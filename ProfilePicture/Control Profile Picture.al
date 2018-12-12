controladdin "Profile Picture" {
    Scripts =
        'Common/jquery-3.3.1.min.js',
        'Common/html.js',
        'ProfilePicture/Scripts/profile-picture.js';
    StartupScript = 'ProfilePicture/Scripts/startup.js';
    Images = 'ProfilePicture/Html/camera.html';

    RequestedHeight = 1; // Some bug in 2018 prevents this from being 0
    RequestedWidth = 1;
    MaximumHeight = 1;
    MaximumWidth = 1;
    VerticalStretch = false;
    HorizontalStretch = false;

    event ControlReady();
    event SavePicture(Picture: Text);
    procedure SendPicture(Picture: Text);
}