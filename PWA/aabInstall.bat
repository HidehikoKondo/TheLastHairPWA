@echo off
cd /d %~dp0
@rem ↓↓必要事項を記入↓↓
set File_Bundle=C:\Users\udonk\Downloads\bundletool-all-0.14.0
set File_App=..\Documents\Bitbucket\TheLastHairWeb\PWA\svgomg-twa-master\svgomg-twa-master\app\release\app-release
set Path_Key=..\Documents\Bitbucket\TheLastHairWeb\PWA\keystore.jks
set Pass_Key=Iamin758
set Alias=key0
set Pass_Alius=Iamin758
@rem ↑↑必要事項を記入↑↑
@rem ----変数設定
set Path_Now=%~dp0
set Path_Get=%Path_Now%%File_App%.aab
set Path_Out=%Path_Now%%File_App%.apks
set Path_Out_Srch=%File_App%.apks
set File_Bndle_Fix=%File_Bundle%.jar
@rem ----apks作成済みなら削除
if exist %Path_Out_Srch% ( del %Path_Out%)
@rem ----apks作成処理
java -jar %File_Bndle_Fix% build-apks^
 --bundle=%Path_Get%^
 --output=%Path_Out%^
 --ks=%Path_Key%^
 --ks-pass=pass:%Pass_Key%^
 --ks-key-alias=%Alias%^
 --key-pass=pass:%Pass_Alius%
@rem ----apksをインストール※USB接続している実機が対象
java -jar %File_Bndle_Fix% install-apks^
 --apks=%Path_Out%\
pause \