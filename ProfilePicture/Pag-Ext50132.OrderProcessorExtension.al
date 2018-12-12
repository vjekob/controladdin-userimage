pageextension 50132 "O365 Activities Extension" extends "O365 Activities"
{
    layout
    {
        addlast(Content)
        {
            usercontrol(ProfilePicture; "Profile Picture")
            {
                ApplicationArea = All;

                trigger SavePicture(Picture: Text);
                var
                    UserSetup: Record "User Setup";
                    OutStr: OutStream;
                begin
                    if not UserSetup.Get(UserId) then begin
                        UserSetup."User ID" := UserId;
                        UserSetup.Insert(false);
                    end;
                    UserSetup."User Picture".CreateOutStream(OutStr);
                    OutStr.Write(Picture);
                    UserSetup.Modify(false);
                end;

                trigger ControlReady();
                var
                    UserSetup: Record "User Setup";
                    InStr: InStream;
                    Picture: Text;
                begin
                    if (not UserSetup.Get(UserId)) or (not UserSetup."User Picture".HasValue()) then
                        exit;
                    UserSetup.CalcFields("User Picture");
                    UserSetup."User Picture".CreateInStream(InStr);
                    InStr.Read(Picture);
                    CurrPage.ProfilePicture.SendPicture(Picture);
                end;
            }
        }
    }
}