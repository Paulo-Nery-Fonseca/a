module.exports = {
  env: {
    jquery: true,
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    // Required for Foundry compatibility
    "no-underscore-dangle": "off",
    "import/extensions": "off",
    "class-methods-use-this": "off",
    // Personal Preference
    "linebreak-style": "off",
    "no-mixed-operators": "off",
    "no-param-reassign": "off",
    "no-continue": "off",
    "no-console": "off",
    //"brace-style": ["error"],
    "no-unused-vars": "off",
    "newline-per-chained-call": "off",
    "no-plusplus": "off",
  },
  globals: {
    AudioHelper: "readonly",
    Collection: "readonly",
    Hooks: "readonly",
    KeyboardManager: "readonly",
    ClientSettings: "readonly",
    WorldSettingsStorage: "readonly",
    SetupConfiguration: "readonly",
    SocketInterface: "readonly",
    SortingHelpers: "readonly",
    VideoHelper: "readonly",
    Application: "readonly",
    FormApplication: "readonly",
    BaseEntitySheet: "readonly",
    Localization: "readonly",
    Game: "readonly",
    Die: "readonly",
    FateDie: "readonly",
    DicePool: "readonly",
    Roll: "readonly",
    MersenneTwister: "readonly",
    EntityCollection: "readonly",
    Compendium: "readonly",
    Entity: "readonly",
    Canvas: "readonly",
    CanvasLayer: "readonly",
    PlaceableObject: "readonly",
    PlaceablesLayer: "readonly",
    ContextMenu: "readonly",
    Dialog: "readonly",
    Draggable: "readonly",
    DragDrop: "readonly",
    TextEditor: "readonly",
    FilePicker: "readonly",
    Notifications: "readonly",
    Tabs: "readonly",
    TabsV2: "readonly",
    WebRTC: "readonly",
    WebRTCInterface: "readonly",
    WebRTCSettings: "readonly",
    ActorSheet: "readonly",
    AVConfig: "readonly",
    CombatTrackerConfig: "readonly",
    FolderConfig: "readonly",
    GridConfig: "readonly",
    ImagePopout: "readonly",
    ItemSheet: "readonly",
    JournalSheet: "readonly",
    MacroConfig: "readonly",
    MeasuredTemplateConfig: "readonly",
    PermissionControl: "readonly",
    PlayerConfig: "readonly",
    PlaylistConfig: "readonly",
    PlaylistSoundConfig: "readonly",
    RollTableConfig: "readonly",
    SceneConfig: "readonly",
    EntitySheetConfig: "readonly",
    CameraPopoutAppWrapper: "readonly",
    CameraViews: "readonly",
    ChatBubbles: "readonly",
    HeadsUpDisplay: "readonly",
    SceneControls: "readonly",
    Hotbar: "readonly",
    BasePlaceableHUD: "readonly",
    MainMenu: "readonly",
    SceneNavigation: "readonly",
    Pause: "readonly",
    PlayerList: "readonly",
    DrawingConfig: "readonly",
    DrawingHUD: "readonly",
    LightConfig: "readonly",
    NoteConfig: "readonly",
    AmbientSoundConfig: "readonly",
    TileConfig: "readonly",
    TileHUD: "readonly",
    TokenConfig: "readonly",
    TokenHUD: "readonly",
    WallConfig: "readonly",
    EULA: "readonly",
    InstallPackage: "readonly",
    SetupConfigurationForm: "readonly",
    UpdateNotes: "readonly",
    UserManagement: "readonly",
    WorldConfig: "readonly",
    Sidebar: "readonly",
    SidebarTab: "readonly",
    SidebarDirectory: "readonly",
    Actors: "readonly",
    Actor: "readonly",
    ActorTokenHelpers: "readonly",
    CombatEncounters: "readonly",
    Combat: "readonly",
    Folders: "readonly",
    Folder: "readonly",
    Items: "readonly",
    Item: "readonly",
    ActiveEffect: "readonly",
    Journal: "readonly",
    JournalEntry: "readonly",
    Macros: "readonly",
    Macro: "readonly",
    Messages: "readonly",
    ChatMessage: "readonly",
    Playlists: "readonly",
    Playlist: "readonly",
    Scenes: "readonly",
    Scene: "readonly",
    RollTables: "readonly",
    RollTable: "readonly",
    Users: "readonly",
    User: "readonly",
    UserTargets: "readonly",
    CanvasAnimation: "readonly",
    ControlIcon: "readonly",
    TextureLoader: "readonly",
    MouseInteractionManager: "readonly",
    Ray: "readonly",
    NormalizedRectangle: "readonly",
    ResizeHandle: "readonly",
    SightLayerSource: "readonly",
    BackgroundLayer: "readonly",
    DrawingsLayer: "readonly",
    EffectsLayer: "readonly",
    LightingLayer: "readonly",
    NotesLayer: "readonly",
    SightLayer: "readonly",
    SoundsLayer: "readonly",
    TemplateLayer: "readonly",
    TilesLayer: "readonly",
    TokenLayer: "readonly",
    WallsLayer: "readonly",
    Drawing: "readonly",
    AmbientLight: "readonly",
    Note: "readonly",
    AmbientSound: "readonly",
    MeasuredTemplate: "readonly",
    Tile: "readonly",
    Token: "readonly",
    Wall: "readonly",
    SettingsConfig: "readonly",
    ControlsReference: "readonly",
    InvitationLinks: "readonly",
    ModuleManagement: "readonly",
    PermissionConfig: "readonly",
    ActorDirectory: "readonly",
    ChatLog: "readonly",
    CombatTracker: "readonly",
    CompendiumDirectory: "readonly",
    ItemDirectory: "readonly",
    JournalDirectory: "readonly",
    MacroDirectory: "readonly",
    PlaylistDirectory: "readonly",
    SceneDirectory: "readonly",
    Settings: "readonly",
    FrameViewer: "readonly",
    RollTableDirectory: "readonly",
    Cursor: "readonly",
    DoorControl: "readonly",
    ControlsLayer: "readonly",
    Ruler: "readonly",
    SpecialEffect: "readonly",
    AutumnLeavesWeatherEffect: "readonly",
    RainWeatherEffect: "readonly",
    SnowWeatherEffect: "readonly",
    BaseGrid: "readonly",
    HexagonalGrid: "readonly",
    GridHighlight: "readonly",
    GridLayer: "readonly",
    SquareGrid: "readonly",
    EasyRTCClient: "readonly",
    parent: "readonly",
    opener: "readonly",
    top: "readonly",
    length: "readonly",
    frames: "readonly",
    closed: "readonly",
    location: "readonly",
    self: "readonly",
    window: "readonly",
    document: "readonly",
    name: "readonly",
    customElements: "readonly",
    history: "readonly",
    locationbar: "readonly",
    menubar: "readonly",
    personalbar: "readonly",
    scrollbars: "readonly",
    statusbar: "readonly",
    toolbar: "readonly",
    status: "readonly",
    frameElement: "readonly",
    navigator: "readonly",
    origin: "readonly",
    external: "readonly",
    screen: "readonly",
    innerWidth: "readonly",
    innerHeight: "readonly",
    scrollX: "readonly",
    pageXOffset: "readonly",
    scrollY: "readonly",
    pageYOffset: "readonly",
    visualViewport: "readonly",
    screenX: "readonly",
    screenY: "readonly",
    outerWidth: "readonly",
    outerHeight: "readonly",
    devicePixelRatio: "readonly",
    clientInformation: "readonly",
    screenLeft: "readonly",
    screenTop: "readonly",
    defaultStatus: "readonly",
    defaultstatus: "readonly",
    styleMedia: "readonly",
    onsearch: "readonly",
    isSecureContext: "readonly",
    onabort: "readonly",
    onblur: "readonly",
    oncancel: "readonly",
    oncanplay: "readonly",
    oncanplaythrough: "readonly",
    onchange: "readonly",
    onclick: "readonly",
    onclose: "readonly",
    oncontextmenu: "readonly",
    oncuechange: "readonly",
    ondblclick: "readonly",
    ondrag: "readonly",
    ondragend: "readonly",
    ondragenter: "readonly",
    ondragleave: "readonly",
    ondragover: "readonly",
    ondragstart: "readonly",
    ondrop: "readonly",
    ondurationchange: "readonly",
    onemptied: "readonly",
    onended: "readonly",
    onerror: "readonly",
    onfocus: "readonly",
    onformdata: "readonly",
    oninput: "readonly",
    oninvalid: "readonly",
    onkeydown: "readonly",
    onkeypress: "readonly",
    onkeyup: "readonly",
    onload: "readonly",
    onloadeddata: "readonly",
    onloadedmetadata: "readonly",
    onloadstart: "readonly",
    onmousedown: "readonly",
    onmouseenter: "readonly",
    onmouseleave: "readonly",
    onmousemove: "readonly",
    onmouseout: "readonly",
    onmouseover: "readonly",
    onmouseup: "readonly",
    onmousewheel: "readonly",
    onpause: "readonly",
    onplay: "readonly",
    onplaying: "readonly",
    onprogress: "readonly",
    onratechange: "readonly",
    onreset: "readonly",
    onresize: "readonly",
    onscroll: "readonly",
    onseeked: "readonly",
    onseeking: "readonly",
    onselect: "readonly",
    onstalled: "readonly",
    onsubmit: "readonly",
    onsuspend: "readonly",
    ontimeupdate: "readonly",
    ontoggle: "readonly",
    onvolumechange: "readonly",
    onwaiting: "readonly",
    onwebkitanimationend: "readonly",
    onwebkitanimationiteration: "readonly",
    onwebkitanimationstart: "readonly",
    onwebkittransitionend: "readonly",
    onwheel: "readonly",
    onauxclick: "readonly",
    ongotpointercapture: "readonly",
    onlostpointercapture: "readonly",
    onpointerdown: "readonly",
    onpointermove: "readonly",
    onpointerup: "readonly",
    onpointercancel: "readonly",
    onpointerover: "readonly",
    onpointerout: "readonly",
    onpointerenter: "readonly",
    onpointerleave: "readonly",
    onselectstart: "readonly",
    onselectionchange: "readonly",
    onanimationend: "readonly",
    onanimationiteration: "readonly",
    onanimationstart: "readonly",
    ontransitionend: "readonly",
    onafterprint: "readonly",
    onbeforeprint: "readonly",
    onbeforeunload: "readonly",
    onhashchange: "readonly",
    onlanguagechange: "readonly",
    onmessage: "readonly",
    onmessageerror: "readonly",
    onoffline: "readonly",
    ononline: "readonly",
    onpagehide: "readonly",
    onpageshow: "readonly",
    onpopstate: "readonly",
    onrejectionhandled: "readonly",
    onstorage: "readonly",
    onunhandledrejection: "readonly",
    onunload: "readonly",
    performance: "readonly",
    stop: "readonly",
    open: "readonly",
    alert: "readonly",
    confirm: "readonly",
    prompt: "readonly",
    print: "readonly",
    queueMicrotask: "readonly",
    requestAnimationFrame: "readonly",
    cancelAnimationFrame: "readonly",
    captureEvents: "readonly",
    releaseEvents: "readonly",
    requestIdleCallback: "readonly",
    cancelIdleCallback: "readonly",
    getComputedStyle: "readonly",
    matchMedia: "readonly",
    moveTo: "readonly",
    moveBy: "readonly",
    resizeTo: "readonly",
    resizeBy: "readonly",
    scroll: "readonly",
    scrollTo: "readonly",
    scrollBy: "readonly",
    getSelection: "readonly",
    find: "readonly",
    webkitRequestAnimationFrame: "readonly",
    webkitCancelAnimationFrame: "readonly",
    fetch: "readonly",
    btoa: "readonly",
    atob: "readonly",
    setTimeout: "readonly",
    clearTimeout: "readonly",
    setInterval: "readonly",
    clearInterval: "readonly",
    createImageBitmap: "readonly",
    close: "readonly",
    focus: "readonly",
    blur: "readonly",
    postMessage: "readonly",
    onappinstalled: "readonly",
    onbeforeinstallprompt: "readonly",
    crypto: "readonly",
    indexedDB: "readonly",
    webkitStorageInfo: "readonly",
    sessionStorage: "readonly",
    localStorage: "readonly",
    chrome: "readonly",
    applicationCache: "readonly",
    onpointerrawupdate: "readonly",
    trustedTypes: "readonly",
    speechSynthesis: "readonly",
    webkitRequestFileSystem: "readonly",
    webkitResolveLocalFileSystemURL: "readonly",
    openDatabase: "readonly",
    caches: "readonly",
    ondevicemotion: "readonly",
    ondeviceorientation: "readonly",
    ondeviceorientationabsolute: "readonly",
    Handlebars: "readonly",
    HandlebarsIntl: "readonly",
    HowlerGlobal: "readonly",
    Howler: "readonly",
    Howl: "readonly",
    Sound: "readonly",
    WebFont: "readonly",
    PIXI: "readonly",
    io: "readonly",
    tinymce: "readonly",
    tinyMCE: "readonly",
    easyrtc_lang: "readonly",
    adapter: "readonly",
    easyrtc: "readonly",
    duplicate: "readonly",
    getType: "readonly",
    invertObject: "readonly",
    filterObject: "readonly",
    flattenObject: "readonly",
    expandObject: "readonly",
    isObjectEmpty: "readonly",
    mergeObject: "readonly",
    diffObject: "readonly",
    hasProperty: "readonly",
    getProperty: "readonly",
    setProperty: "readonly",
    encodeURL: "readonly",
    rgbToHsv: "readonly",
    hsvToRgb: "readonly",
    rgbToHex: "readonly",
    hexToRGB: "readonly",
    hexToRGBAString: "readonly",
    colorStringToHex: "readonly",
    isNewerVersion: "readonly",
    randomID: "readonly",
    loadFont: "readonly",
    saveDataToFile: "readonly",
    readTextFromFile: "readonly",
    fromUuid: "readonly",
    _handleMouseWheelInputChange: "readonly",
    getTemplate: "readonly",
    loadTemplates: "readonly",
    renderTemplate: "readonly",
    srcExists: "readonly",
    getTexture: "readonly",
    loadTexture: "readonly",
    CONST: "readonly",
    toDegrees: "readonly",
    normalizeDegrees: "readonly",
    toRadians: "readonly",
    normalizeRadians: "readonly",
    validateForm: "readonly",
    timeSince: "readonly",
    _templateCache: "readonly",
    CONFIG: "readonly",
    socket: "readonly",
    ui: "readonly",
    canvas: "readonly",
    keyboard: "readonly",
    JSHINT: "readonly",
    game: "readonly",
    vtt: "readonly",
    ENTITY_PERMISSIONS: "readonly",
    DEFAULT_TOKEN: "readonly",
    DiceTerm: "readonly",
    GRID_TYPES: "readonly",
    dragRuler: "readonly",
  },
};
