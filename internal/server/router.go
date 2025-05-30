package server

import (
	"context"
	"log/slog"
	"net/http"
	"plefi/internal/config"
	"plefi/internal/controllers"
	"plefi/internal/services"
	"sort"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

// NewRouter sets up and configures the application router with all routes.
func NewRouter(svcs *services.Services, client *http.Client) *echo.Echo {
	// Initialize router
	e := echo.New()
	e.Use(middleware.Recover())
	e.Use(middleware.RequestID())
	e.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
		LogStatus:    true,
		LogURI:       true,
		LogError:     true,
		LogMethod:    true,
		LogRemoteIP:  true,
		LogRequestID: true,
		HandleError:  true, // forwards error to the global error handler, so it can decide appropriate status code
		LogValuesFunc: func(c echo.Context, v middleware.RequestLoggerValues) error {
			if v.Error == nil {
				slog.LogAttrs(context.Background(), slog.LevelInfo, "req",
					slog.String("remote_ip", v.RemoteIP),
					slog.String("request_id", v.RequestID),
					slog.String("method", v.Method),
					slog.String("uri", v.URI),
					slog.Int("status", v.Status),
				)
			} else {
				slog.LogAttrs(context.Background(), slog.LevelError, "req",
					slog.String("remote_ip", v.RemoteIP),
					slog.String("request_id", v.RequestID),
					slog.String("method", v.Method),
					slog.String("uri", v.URI),
					slog.Int("status", v.Status),
					slog.String("err", v.Error.Error()),
				)
			}
			return nil
		},
	}))
	e.Use(session.Middleware(sessions.NewCookieStore([]byte(config.C.Auth.SessionSecret))))
	e.Use(middleware.StaticWithConfig(middleware.StaticConfig{
		Root:  config.C.Server.StaticPath,
		HTML5: true,
	}))

	xffHeaders := []echo.TrustOption{
		echo.TrustLoopback(true),
	}
	if config.C.Server.TrustedProxies != nil {
		xffHeaders = append(xffHeaders, echo.TrustIPRange(config.C.Server.TrustedProxies))
	}

	e.IPExtractor = echo.ExtractIPFromXFFHeader(
		xffHeaders...,
	)

	// Initialize controllers
	appController := controllers.NewAppController(client, svcs)
	appController.GetRoutes(e)

	// Sort routes by path before logging
	routes := e.Routes()
	sort.Slice(routes, func(i, j int) bool {
		return routes[i].Path < routes[j].Path
	})

	for _, route := range routes {
		slog.Info("Route registered", "method", route.Method, "path", route.Path)
	}
	return e
}
