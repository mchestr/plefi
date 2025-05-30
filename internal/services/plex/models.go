package plex

import "time"

// PlexUser represents a user in the Plex system
type PlexUser struct {
	ID                        int          `json:"id" xml:"id,attr"`
	Title                     string       `json:"title" xml:"title,attr"`
	Username                  string       `json:"username" xml:"username,attr"`
	Email                     string       `json:"email" xml:"email,attr"`
	RecommendationsPlaylistID string       `json:"recommendationsPlaylistId" xml:"recommendationsPlaylistId,attr"`
	Thumb                     string       `json:"thumb" xml:"thumb,attr"`
	Protected                 int          `json:"protected" xml:"protected,attr"`
	Home                      int          `json:"home" xml:"home,attr"`
	AllowTuners               int          `json:"allowTuners" xml:"allowTuners,attr"`
	AllowSync                 int          `json:"allowSync" xml:"allowSync,attr"`
	AllowCameraUpload         int          `json:"allowCameraUpload" xml:"allowCameraUpload,attr"`
	AllowChannels             int          `json:"allowChannels" xml:"allowChannels,attr"`
	AllowSubtitleAdmin        int          `json:"allowSubtitleAdmin" xml:"allowSubtitleAdmin,attr"`
	FilterAll                 string       `json:"filterAll" xml:"filterAll,attr"`
	FilterMovies              string       `json:"filterMovies" xml:"filterMovies,attr"`
	FilterMusic               string       `json:"filterMusic" xml:"filterMusic,attr"`
	FilterPhotos              string       `json:"filterPhotos" xml:"filterPhotos,attr"`
	FilterTelevision          string       `json:"filterTelevision" xml:"filterTelevision,attr"`
	Restricted                int          `json:"restricted" xml:"restricted,attr"`
	Servers                   []PlexServer `json:"servers,omitempty" xml:"Server,omitempty"`
}

// PlexServer represents a server associated with a Plex user
type PlexServer struct {
	ID                string `json:"id" xml:"id,attr"`
	ServerID          string `json:"serverId" xml:"serverId,attr"`
	MachineIdentifier string `json:"machineIdentifier" xml:"machineIdentifier,attr"`
	Name              string `json:"name" xml:"name,attr"`
	LastSeenAt        string `json:"lastSeenAt" xml:"lastSeenAt,attr"`
	NumLibraries      int    `json:"numLibraries" xml:"numLibraries,attr"`
	AllLibraries      int    `json:"allLibraries" xml:"allLibraries,attr"`
	Owned             int    `json:"owned" xml:"owned,attr"`
	Pending           int    `json:"pending" xml:"pending,attr"`
}

// PlexUsersResponse represents the XML response structure when fetching users list
type PlexUsersResponse struct {
	FriendlyName      string     `xml:"friendlyName,attr"`
	Identifier        string     `xml:"identifier,attr"`
	MachineIdentifier string     `xml:"machineIdentifier,attr"`
	TotalSize         int        `xml:"totalSize,attr"`
	Size              int        `xml:"size,attr"`
	Users             []PlexUser `xml:"User"`
}

// PlexLibrarySection represents a library section in a Plex server
type PlexLibrarySection struct {
	ID    int    `json:"id"`
	Key   int    `json:"key"`
	Title string `json:"title"`
	Type  string `json:"type"`
}

// PlexServerResponse represents the JSON response from the Plex server API
type PlexServerResponse struct {
	Name            string               `json:"name"`
	MachineID       string               `json:"machineIdentifier"`
	LibrarySections []PlexLibrarySection `json:"librarySections"`
}

// PlexDetailedUserResponse represents detailed information about a Plex user from the API v2/user endpoint
type PlexDetailedUserResponse struct {
	ID                   int                      `json:"id"`
	UUID                 string                   `json:"uuid"`
	Username             string                   `json:"username"`
	Title                string                   `json:"title"`
	Email                string                   `json:"email"`
	FriendlyName         string                   `json:"friendlyName"`
	Locale               string                   `json:"locale"`
	Confirmed            bool                     `json:"confirmed"`
	JoinedAt             int64                    `json:"joinedAt"`
	EmailOnlyAuth        bool                     `json:"emailOnlyAuth"`
	HasPassword          bool                     `json:"hasPassword"`
	Protected            bool                     `json:"protected"`
	Thumb                string                   `json:"thumb"`
	AuthToken            string                   `json:"authToken"`
	MailingListStatus    string                   `json:"mailingListStatus"`
	MailingListActive    bool                     `json:"mailingListActive"`
	ScrobbleTypes        string                   `json:"scrobbleTypes"`
	Country              string                   `json:"country"`
	Subscription         map[string]interface{}   `json:"subscription"`
	Restricted           bool                     `json:"restricted"`
	Anonymous            bool                     `json:"anonymous"`
	Home                 bool                     `json:"home"`
	Guest                bool                     `json:"guest"`
	HomeSize             int                      `json:"homeSize"`
	HomeAdmin            bool                     `json:"homeAdmin"`
	MaxHomeSize          int                      `json:"maxHomeSize"`
	RememberExpiresAt    int64                    `json:"rememberExpiresAt"`
	Profile              map[string]interface{}   `json:"profile"`
	Entitlements         []string                 `json:"entitlements"`
	Roles                []string                 `json:"roles"`
	Services             []map[string]interface{} `json:"services"`
	AdsConsent           interface{}              `json:"adsConsent"`
	AdsConsentSetAt      interface{}              `json:"adsConsentSetAt"`
	AdsConsentReminderAt interface{}              `json:"adsConsentReminderAt"`
	ExperimentalFeatures bool                     `json:"experimentalFeatures"`
	TwoFactorEnabled     bool                     `json:"twoFactorEnabled"`
	BackupCodesCreated   bool                     `json:"backupCodesCreated"`
	AttributionPartner   interface{}              `json:"attributionPartner"`
}

// PlexErrorResponse represents a structured error response from Plex API
type PlexErrorResponse struct {
	Errors []PlexError `json:"errors"`
}

// PlexError represents a single error in a Plex API error response
type PlexError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
	Status  int    `json:"status"`
}

// PlexPinResponse represents the response from Plex PIN creation API.
type PlexPinResponse struct {
	ID        int    `json:"id"`
	Code      string `json:"code"`
	AuthToken string `json:"authToken"`
	ClientID  string `json:"clientIdentifier"`
}

// PlexUserResponse represents the user data returned by Plex API.
type PlexUserResponse struct {
	ID        int    `json:"id"`
	UUID      string `json:"uuid"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	Title     string `json:"title"`
	Thumb     string `json:"thumb"`
	AuthToken string `json:"authToken"`
}

// PlexShareResponse represents the JSON returned by the Plex share API
type PlexShareResponse struct {
	Accepted     bool       `json:"accepted"`
	AcceptedAt   *time.Time `json:"acceptedAt"`
	AllLibraries bool       `json:"allLibraries"`
	DeletedAt    *time.Time `json:"deletedAt"`
	ID           int        `json:"id"`
	InviteToken  string     `json:"inviteToken"`
	Invited      struct {
		FriendlyName    *string `json:"friendlyName"`
		Home            bool    `json:"home"`
		ID              int     `json:"id"`
		Restricted      bool    `json:"restricted"`
		SharingSettings struct {
			AllowCameraUpload  bool    `json:"allowCameraUpload"`
			AllowChannels      bool    `json:"allowChannels"`
			AllowSubtitleAdmin bool    `json:"allowSubtitleAdmin"`
			AllowSync          bool    `json:"allowSync"`
			AllowTuners        int     `json:"allowTuners"`
			FilterAll          *string `json:"filterAll"`
			FilterMovies       string  `json:"filterMovies"`
			FilterMusic        string  `json:"filterMusic"`
			FilterPhotos       string  `json:"filterPhotos"`
			FilterTelevision   string  `json:"filterTelevision"`
		} `json:"sharingSettings"`
		Status   string `json:"status"`
		Thumb    string `json:"thumb"`
		Title    string `json:"title"`
		Username string `json:"username"`
		UUID     string `json:"uuid"`
	} `json:"invited"`
	InvitedEmail *string    `json:"invitedEmail"`
	InvitedID    int        `json:"invitedId"`
	LastSeenAt   time.Time  `json:"lastSeenAt"`
	LeftAt       *time.Time `json:"leftAt"`
	Libraries    []struct {
		ID    int    `json:"id"`
		Key   int    `json:"key"`
		Title string `json:"title"`
		Type  string `json:"type"`
	} `json:"libraries"`
	MachineIdentifier string `json:"machineIdentifier"`
	Name              string `json:"name"`
	NumLibraries      int    `json:"numLibraries"`
	Owned             bool   `json:"owned"`
	OwnerID           int    `json:"ownerId"`
	ServerID          int    `json:"serverId"`
	SharingSettings   struct {
		AllowCameraUpload  bool    `json:"allowCameraUpload"`
		AllowChannels      bool    `json:"allowChannels"`
		AllowSubtitleAdmin bool    `json:"allowSubtitleAdmin"`
		AllowSync          bool    `json:"allowSync"`
		AllowTuners        int     `json:"allowTuners"`
		FilterAll          *string `json:"filterAll"`
		FilterMovies       string  `json:"filterMovies"`
		FilterMusic        string  `json:"filterMusic"`
		FilterPhotos       string  `json:"filterPhotos"`
		FilterTelevision   string  `json:"filterTelevision"`
	} `json:"sharingSettings"`
}
