export interface Thread {
    data?:     ThreadData[];
    metadata?: Metadata;
    error?:    null;
}

export interface ThreadData {
    body: any;
    collapsed_reason_code: any;
    approvedAtUTC?:              null;
    subreddit?:                  Subreddit;
    selftext?:                   string;
    authorFullname?:             string;
    saved?:                      boolean;
    modReasonTitle?:             null;
    gilded?:                     number;
    clicked?:                    boolean;
    title?:                      string;
    linkFlairRichtext?:          FlairRichtext[];
    subredditNamePrefixed?:      SubredditNamePrefixed;
    hidden?:                     boolean;
    pwls?:                       number;
    linkFlairCSSClass?:          string;
    downs?:                      number;
    thumbnailHeight?:            number | null;
    topAwardedType?:             null;
    hideScore?:                  boolean;
    name?:                       string;
    quarantine?:                 boolean;
    linkFlairTextColor?:         FlairTextColor;
    upvoteRatio?:                number;
    authorFlairBackgroundColor?: AuthorFlairBackgroundColor | null;
    subredditType?:              SubredditType;
    ups?:                        number;
    totalAwardsReceived?:        number;
    mediaEmbed?:                 MediaEmbed;
    thumbnailWidth?:             number | null;
    authorFlairTemplateID?:      null | string;
    isOriginalContent?:          boolean;
    userReports?:                any[];
    secureMedia?:                DatumMedia | null;
    isRedditMediaDomain?:        boolean;
    isMeta?:                     boolean;
    category?:                   null;
    secureMediaEmbed?:           MediaEmbed;
    linkFlairText?:              string;
    canModPost?:                 boolean;
    score?:                      number;
    approvedBy?:                 null;
    isCreatedFromAdsUI?:         boolean;
    authorPremium?:              boolean;
    thumbnail?:                  string;
    edited?:                     boolean;
    authorFlairCSSClass?:        null | string;
    authorFlairRichtext?:        FlairRichtext[];
    gildings?:                   Gildings;
    postHint?:                   PostHint;
    contentCategories?:          null;
    isSelf?:                     boolean;
    modNote?:                    null;
    created?:                    number;
    linkFlairType?:              FlairType;
    wls?:                        number;
    removedByCategory?:          RemovedByCategory | null;
    bannedBy?:                   null;
    authorFlairType?:            FlairType;
    domain?:                     string;
    allowLiveComments?:          boolean;
    selftextHTML?:               null | string;
    likes?:                      null;
    suggestedSort?:              null;
    bannedAtUTC?:                null;
    viewCount?:                  null;
    archived?:                   boolean;
    noFollow?:                   boolean;
    isCrosspostable?:            boolean;
    pinned?:                     boolean;
    over18?:                     boolean;
    preview?:                    Preview;
    allAwardings?:               any[];
    awarders?:                   any[];
    mediaOnly?:                  boolean;
    linkFlairTemplateID?:        string;
    canGild?:                    boolean;
    spoiler?:                    boolean;
    locked?:                     boolean;
    authorFlairText?:            null | string;
    treatmentTags?:              any[];
    visited?:                    boolean;
    removedBy?:                  null;
    numReports?:                 null;
    distinguished?:              null;
    subredditID?:                SubredditID;
    authorIsBlocked?:            boolean;
    modReasonBy?:                null;
    removalReason?:              null;
    linkFlairBackgroundColor?:   LinkFlairBackgroundColor;
    id?:                         string;
    isRobotIndexable?:           boolean;
    reportReasons?:              null;
    author?:                     string;
    discussionType?:             null;
    numComments?:                number;
    sendReplies?:                boolean;
    whitelistStatus?:            WhitelistStatus;
    contestMode?:                boolean;
    modReports?:                 any[];
    authorPatreonFlair?:         boolean;
    authorFlairTextColor?:       FlairTextColor | null;
    permalink?:                  string;
    parentWhitelistStatus?:      WhitelistStatus;
    stickied?:                   boolean;
    url?:                        string;
    subredditSubscribers?:       number;
    createdUTC?:                 number;
    numCrossposts?:              number;
    media?:                      DatumMedia | null;
    isVideo?:                    boolean;
    urlOverriddenByDest?:        string;
    mediaMetadata?:              null;
    crosspostParentList?:        CrosspostParentList[];
    crosspostParent?:            string;
    isGallery?:                  boolean;
    galleryData?:                null;
}

export enum AuthorFlairBackgroundColor {
    Empty = "",
    The00A6A5 = "#00a6a5",
    Transparent = "transparent",
}

export interface FlairRichtext {
    e?: E;
    t?: string;
    a?: string;
    u?: string;
}

export enum E {
    Emoji = "emoji",
    Text = "text",
}

export enum FlairTextColor {
    Dark = "dark",
    Empty = "",
    Light = "light",
}

export enum FlairType {
    Richtext = "richtext",
    Text = "text",
}

export interface CrosspostParentList {
    approvedAtUTC?:              null;
    subreddit?:                  string;
    selftext?:                   string;
    authorFullname?:             string;
    saved?:                      boolean;
    modReasonTitle?:             null;
    gilded?:                     number;
    clicked?:                    boolean;
    title?:                      string;
    linkFlairRichtext?:          LinkFlairRichtext[];
    subredditNamePrefixed?:      string;
    hidden?:                     boolean;
    pwls?:                       number | null;
    linkFlairCSSClass?:          null | string;
    downs?:                      number;
    thumbnailHeight?:            number | null;
    topAwardedType?:             null;
    hideScore?:                  boolean;
    name?:                       string;
    quarantine?:                 boolean;
    linkFlairTextColor?:         FlairTextColor;
    upvoteRatio?:                number;
    authorFlairBackgroundColor?: null | string;
    ups?:                        number;
    totalAwardsReceived?:        number;
    mediaEmbed?:                 Gildings;
    thumbnailWidth?:             number | null;
    authorFlairTemplateID?:      null | string;
    isOriginalContent?:          boolean;
    userReports?:                any[];
    secureMedia?:                CrosspostParentListMedia | null;
    isRedditMediaDomain?:        boolean;
    isMeta?:                     boolean;
    category?:                   null;
    secureMediaEmbed?:           Gildings;
    linkFlairText?:              null | string;
    canModPost?:                 boolean;
    score?:                      number;
    approvedBy?:                 null;
    isCreatedFromAdsUI?:         boolean;
    authorPremium?:              boolean;
    thumbnail?:                  string;
    edited?:                     boolean;
    authorFlairCSSClass?:        null | string;
    authorFlairRichtext?:        FlairRichtext[];
    gildings?:                   Gildings;
    postHint?:                   PostHint;
    contentCategories?:          null;
    isSelf?:                     boolean;
    subredditType?:              SubredditType;
    created?:                    number;
    linkFlairType?:              FlairType;
    wls?:                        number | null;
    removedByCategory?:          null;
    bannedBy?:                   null;
    authorFlairType?:            FlairType;
    domain?:                     string;
    allowLiveComments?:          boolean;
    selftextHTML?:               null | string;
    likes?:                      null;
    suggestedSort?:              null | string;
    bannedAtUTC?:                null;
    urlOverriddenByDest?:        string;
    viewCount?:                  null;
    archived?:                   boolean;
    noFollow?:                   boolean;
    isCrosspostable?:            boolean;
    pinned?:                     boolean;
    over18?:                     boolean;
    preview?:                    Preview;
    allAwardings?:               any[];
    awarders?:                   any[];
    mediaOnly?:                  boolean;
    linkFlairTemplateID?:        string;
    canGild?:                    boolean;
    spoiler?:                    boolean;
    locked?:                     boolean;
    authorFlairText?:            null | string;
    treatmentTags?:              any[];
    visited?:                    boolean;
    removedBy?:                  null;
    modNote?:                    null;
    distinguished?:              null;
    subredditID?:                string;
    authorIsBlocked?:            boolean;
    modReasonBy?:                null;
    numReports?:                 null;
    removalReason?:              null;
    linkFlairBackgroundColor?:   string;
    id?:                         string;
    isRobotIndexable?:           boolean;
    reportReasons?:              null;
    author?:                     string;
    discussionType?:             null;
    numComments?:                number;
    sendReplies?:                boolean;
    whitelistStatus?:            WhitelistStatus | null;
    contestMode?:                boolean;
    modReports?:                 any[];
    authorPatreonFlair?:         boolean;
    authorFlairTextColor?:       FlairTextColor | null;
    permalink?:                  string;
    parentWhitelistStatus?:      WhitelistStatus | null;
    stickied?:                   boolean;
    url?:                        string;
    subredditSubscribers?:       number;
    createdUTC?:                 number;
    numCrossposts?:              number;
    media?:                      CrosspostParentListMedia | null;
    isVideo?:                    boolean;
}

export interface Gildings {
    gid1?: number;
    gid2?: number;
    gid3?: number;
}
export interface LinkFlairRichtext {
    e?: E;
    t?: string;
}

export interface CrosspostParentListMedia {
    redditVideo?: RedditVideo;
}

export interface RedditVideo {
    bitrateKbps?:       number;
    fallbackURL?:       string;
    hasAudio?:          boolean;
    height?:            number;
    width?:             number;
    scrubberMediaURL?:  string;
    dashURL?:           string;
    duration?:          number;
    hlsURL?:            string;
    isGIF?:             boolean;
    transcodingStatus?: string;
}

export enum WhitelistStatus {
    AllAds = "all_ads",
}

export enum PostHint {
    HostedVideo = "hosted:video",
    Image = "image",
    Link = "link",
    RichVideo = "rich:video",
    Self = "self",
}

export interface Preview {
    images?:  Image[];
    enabled?: boolean;
}

export interface Image {
    source?:      Source;
    resolutions?: Source[];
    variants?:    Gildings;
    id?:          string;
}

export interface Source {
    url?:    string;
    width?:  number;
    height?: number;
}

export enum SubredditType {
    Public = "public",
}

export enum LinkFlairBackgroundColor {
    Cc3600 = "#cc3600",
    Ffd635 = "#ffd635",
    The007373 = "#007373",
    The014980 = "#014980",
    The6B6031 = "#6b6031",
}

export interface DatumMedia {
    type?:        string;
    oembed?:      Oembed;
    redditVideo?: RedditVideo;
}

export interface Oembed {
    providerURL?:     string;
    version?:         string;
    title?:           string;
    type?:            string;
    thumbnailWidth?:  number;
    height?:          number;
    width?:           number;
    html?:            string;
    authorName?:      string;
    providerName?:    string;
    thumbnailURL?:    string;
    thumbnailHeight?: number;
    authorURL?:       string;
}

export interface MediaEmbed {
    content?:        string;
    width?:          number;
    scrolling?:      boolean;
    height?:         number;
    mediaDomainURL?: string;
}

export enum RemovedByCategory {
    AutomodFiltered = "automod_filtered",
    Deleted = "deleted",
    Moderator = "moderator",
    Reddit = "reddit",
}

export enum Subreddit {
    Croatia = "croatia",
}

export enum SubredditID {
    T52Qyps = "t5_2qyps",
}

export enum SubredditNamePrefixed {
    RCroatia = "r/croatia",
}

export interface Metadata {
    opA?:   number;
    opB?:   number;
    total?: number;
}
