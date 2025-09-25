# Deep System Audit Report
**Generated:** 2025-09-25 10:24:14
**System:** Linux sahon-All-Series 6.14.0-29-generic #29~24.04.1-Ubuntu SMP PREEMPT_DYNAMIC Thu Aug 14 16:52:50 UTC 2 x86_64 x86_64 x86_64 GNU/Linux
**User:** sahon
**Project Directory:** /home/sahon/Desktop/Hello Zombie

---


## System Information

### System Information
**OS Version:** Ubuntu 24.04.3 LTS
**Kernel:** 6.14.0-29-generic
**Architecture:** x86_64
**Uptime:**  10:24:14 up 21 min,  1 user,  load average: 1.81, 1.53, 1.41
**Memory:** 15Gi total, 6.4Gi used, 9.1Gi available
**Disk Usage:** 105G total, 78G used, 23G available (78% used)

## Running Processes and Ports

### Running Processes and Ports
**Python Processes:**
root        1295  0.0  0.1 112260 22756 ?        Ssl  10:02   0:00 /usr/bin/python3 /usr/share/unattended-upgrades/unattended-upgrade-shutdown --wait-for-signal

**Node.js Processes:**
root        2158  0.0  0.0   2704  1940 ?        Ss   10:03   0:00 fusermount3 -o rw,nosuid,nodev,fsname=portal,auto_unmount,subtype=portal -- /run/user/1000/doc
sahon       3479  3.0  1.2 34397036 203956 ?     Sl   10:05   0:34 /opt/google/chrome/chrome --type=gpu-process --ozone-platform=wayland --render-node-override=/dev/dri/renderD128 --crashpad-handler-pid=3439 --enable-crash-reporter=8c7c15b2-34b6-4a3e-9fab-70ef935952ff, --change-stack-guard-on-fork=enable --gpu-preferences=UAAAAAAAAAAgAQAIAAAAAAAAAAAAAGAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAAAAAABgAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAgAAAAAAAAA --shared-files --metrics-shmem-handle=4,i,12739179794999327044,110640318599337805,262144 --field-trial-handle=3,i,3267123168142022333,2178670596907554441,262144 --disable-features=EyeDropper --variations-seed-version=20250922-050034.017000
sahon       3485  1.3  0.7 33949312 129488 ?     Sl   10:05   0:14 /opt/google/chrome/chrome --type=utility --utility-sub-type=network.mojom.NetworkService --lang=en-US --service-sandbox-type=none --render-node-override=/dev/dri/renderD128 --crashpad-handler-pid=3439 --enable-crash-reporter=8c7c15b2-34b6-4a3e-9fab-70ef935952ff, --change-stack-guard-on-fork=enable --shared-files=v8_context_snapshot_data:100 --metrics-shmem-handle=4,i,5274611180583474824,11072254728106661104,524288 --field-trial-handle=3,i,3267123168142022333,2178670596907554441,262144 --disable-features=EyeDropper --variations-seed-version=20250922-050034.017000
sahon       3501  0.0  0.3 34003320 58020 ?      Sl   10:05   0:00 /opt/google/chrome/chrome --type=utility --utility-sub-type=storage.mojom.StorageService --lang=en-US --service-sandbox-type=utility --render-node-override=/dev/dri/renderD128 --crashpad-handler-pid=3439 --enable-crash-reporter=8c7c15b2-34b6-4a3e-9fab-70ef935952ff, --change-stack-guard-on-fork=enable --shared-files=v8_context_snapshot_data:100 --metrics-shmem-handle=4,i,3559144193631054691,5135850193183159150,524288 --field-trial-handle=3,i,3267123168142022333,2178670596907554441,262144 --disable-features=EyeDropper --variations-seed-version=20250922-050034.017000
sahon       3675  0.0  0.4 1459689728 66224 ?    Sl   10:05   0:00 /opt/google/chrome/chrome --type=utility --utility-sub-type=proxy_resolver.mojom.ProxyResolverFactory --lang=en-US --service-sandbox-type=service --render-node-override=/dev/dri/renderD128 --crashpad-handler-pid=3439 --enable-crash-reporter=8c7c15b2-34b6-4a3e-9fab-70ef935952ff, --change-stack-guard-on-fork=enable --shared-files=v8_context_snapshot_data:100 --metrics-shmem-handle=4,i,10552061009153600033,5797661991599793691,524288 --field-trial-handle=3,i,3267123168142022333,2178670596907554441,262144 --disable-features=EyeDropper --variations-seed-version=20250922-050034.017000
sahon       5676  9.7  2.8 1219672260 460088 ?   Rl   10:09   1:25 /tmp/.mount_Cursor8i6HHq/usr/share/cursor/cursor --type=renderer --crashpad-handler-pid=5627 --enable-crash-reporter=9d6569b2-5df3-4e63-ab91-989fa19c31b1,no_channel --user-data-dir=/home/sahon/.config/Cursor --standard-schemes=vscode-webview,vscode-file --enable-sandbox --secure-schemes=vscode-webview,vscode-file --cors-schemes=vscode-webview,vscode-file --fetch-schemes=vscode-webview,vscode-file --service-worker-schemes=vscode-webview --code-cache-schemes=vscode-webview,vscode-file --app-path=/tmp/.mount_Cursor8i6HHq/usr/share/cursor/resources/app --enable-sandbox --enable-blink-features=HighlightAPI --force-gpu-mem-available-mb=1024 --js-flags=--nodecommit_pooled_pages --disable-blink-features=FontMatchingCTMigration,StandardizedBrowserZoom, --lang=en-US --num-raster-threads=2 --enable-main-frame-before-activation --renderer-client-id=4 --time-ticks-at-unix-epoch=-1758772971869461 --launch-time-ticks=404852130 --shared-files=v8_context_snapshot_data:100 --field-trial-handle=3,i,6645597387218892741,4081698821329569276,262144 --enable-features=DocumentPolicyIncludeJSCallStacksInCrashReports --disable-features=CalculateNativeWinOcclusion,PlzDedicatedWorker,SpareRendererForSitePerProcess --variations-seed-version --vscode-window-config=vscode:98e963ee-c221-4b87-beb1-77b45f9f661a
sahon       5709  1.0  0.9 1217892972 153780 ?   Sl   10:09   0:08 /tmp/.mount_Cursor8i6HHq/usr/share/cursor/cursor --type=utility --utility-sub-type=node.mojom.NodeService --lang=en-US --service-sandbox-type=none --crashpad-handler-pid=5627 --enable-crash-reporter=9d6569b2-5df3-4e63-ab91-989fa19c31b1,no_channel --user-data-dir=/home/sahon/.config/Cursor --standard-schemes=vscode-webview,vscode-file --enable-sandbox --secure-schemes=vscode-webview,vscode-file --cors-schemes=vscode-webview,vscode-file --fetch-schemes=vscode-webview,vscode-file --service-worker-schemes=vscode-webview --code-cache-schemes=vscode-webview,vscode-file --shared-files=v8_context_snapshot_data:100 --field-trial-handle=3,i,6645597387218892741,4081698821329569276,262144 --enable-features=DocumentPolicyIncludeJSCallStacksInCrashReports --disable-features=CalculateNativeWinOcclusion,PlzDedicatedWorker,SpareRendererForSitePerProcess --variations-seed-version
sahon       5710  0.2  0.6 1217909916 109680 ?   Sl   10:09   0:02 /tmp/.mount_Cursor8i6HHq/usr/share/cursor/cursor --type=utility --utility-sub-type=node.mojom.NodeService --lang=en-US --service-sandbox-type=none --crashpad-handler-pid=5627 --enable-crash-reporter=9d6569b2-5df3-4e63-ab91-989fa19c31b1,no_channel --user-data-dir=/home/sahon/.config/Cursor --standard-schemes=vscode-webview,vscode-file --enable-sandbox --secure-schemes=vscode-webview,vscode-file --cors-schemes=vscode-webview,vscode-file --fetch-schemes=vscode-webview,vscode-file --service-worker-schemes=vscode-webview --code-cache-schemes=vscode-webview,vscode-file --shared-files=v8_context_snapshot_data:100 --field-trial-handle=3,i,6645597387218892741,4081698821329569276,262144 --enable-features=DocumentPolicyIncludeJSCallStacksInCrashReports --disable-features=CalculateNativeWinOcclusion,PlzDedicatedWorker,SpareRendererForSitePerProcess --variations-seed-version
sahon       5711  0.3  0.6 1217918292 113116 ?   Sl   10:09   0:02 /tmp/.mount_Cursor8i6HHq/usr/share/cursor/cursor --type=utility --utility-sub-type=node.mojom.NodeService --lang=en-US --service-sandbox-type=none --crashpad-handler-pid=5627 --enable-crash-reporter=9d6569b2-5df3-4e63-ab91-989fa19c31b1,no_channel --user-data-dir=/home/sahon/.config/Cursor --standard-schemes=vscode-webview,vscode-file --enable-sandbox --secure-schemes=vscode-webview,vscode-file --cors-schemes=vscode-webview,vscode-file --fetch-schemes=vscode-webview,vscode-file --service-worker-schemes=vscode-webview --code-cache-schemes=vscode-webview,vscode-file --shared-files=v8_context_snapshot_data:100 --field-trial-handle=3,i,6645597387218892741,4081698821329569276,262144 --enable-features=DocumentPolicyIncludeJSCallStacksInCrashReports --disable-features=CalculateNativeWinOcclusion,PlzDedicatedWorker,SpareRendererForSitePerProcess --variations-seed-version
sahon       5902  0.0  0.5 1216114620 92020 ?    Sl   10:09   0:00 /tmp/.mount_Cursor8i6HHq/usr/share/cursor/cursor /home/sahon/.cursor/extensions/mtxr.sqltools-0.28.5/dist/languageserver.js --node-ipc --clientProcessId=5756
sahon       6084  0.0  0.5 1216114620 81352 ?    Sl   10:09   0:00 /tmp/.mount_Cursor8i6HHq/usr/share/cursor/cursor /home/sahon/.cursor/extensions/ms-edgedevtools.vscode-edge-devtools-2.1.9/node_modules/vscode-webhint/dist/src/server.js /home/sahon/.config/Cursor/User/globalStorage/ms-edgedevtools.vscode-edge-devtools Microsoft Edge Tools --node-ipc --clientProcessId=5756
sahon       6768  2.0  0.5 34098772 90444 ?      Sl   10:12   0:13 /opt/google/chrome/chrome --type=utility --utility-sub-type=audio.mojom.AudioService --lang=en-US --service-sandbox-type=none --render-node-override=/dev/dri/renderD128 --crashpad-handler-pid=3439 --enable-crash-reporter=8c7c15b2-34b6-4a3e-9fab-70ef935952ff, --change-stack-guard-on-fork=enable --shared-files=v8_context_snapshot_data:100 --metrics-shmem-handle=4,i,15003625539190424141,8540092356573782674,524288 --field-trial-handle=3,i,3267123168142022333,2178670596907554441,262144 --disable-features=EyeDropper --variations-seed-version=20250922-050034.017000
sahon       8506  0.1  0.5 1216114624 81412 ?    Sl   10:20   0:00 /tmp/.mount_Cursor8i6HHq/usr/share/cursor/cursor /home/sahon/.cursor/extensions/dbaeumer.vscode-eslint-3.0.16/server/out/eslintServer.js --node-ipc --clientProcessId=5756
sahon       8518  0.1  0.5 1216114624 89904 ?    Sl   10:20   0:00 /tmp/.mount_Cursor8i6HHq/usr/share/cursor/cursor /tmp/.mount_Cursor8i6HHq/usr/share/cursor/resources/app/extensions/markdown-language-features/dist/serverWorkerMain --node-ipc --clientProcessId=5756

**Active Network Connections:**
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name    
tcp        0      0 127.0.0.54:53           0.0.0.0:*               LISTEN      -                   
tcp        0      0 0.0.0.0:54112           0.0.0.0:*               LISTEN      5756/next-server (v 
tcp        0      0 127.0.0.53:53           0.0.0.0:*               LISTEN      -                   
tcp        0      0 127.0.0.1:11434         0.0.0.0:*               LISTEN      -                   
tcp        0      0 127.0.0.1:3306          0.0.0.0:*               LISTEN      -                   
tcp        0      0 127.0.0.1:631           0.0.0.0:*               LISTEN      -                   
tcp        0      0 127.0.0.1:33060         0.0.0.0:*               LISTEN      -                   
tcp6       0      0 :::80                   :::*                    LISTEN      -                   
tcp6       0      0 :::54113                :::*                    LISTEN      5756/next-server (v 
tcp6       0      0 ::1:631                 :::*                    LISTEN      -                   
udp        0      0 224.0.0.251:5353        0.0.0.0:*                           3485/renderD128 --c 
udp        0      0 0.0.0.0:5353            0.0.0.0:*                           -                   
udp        0      0 0.0.0.0:46527           0.0.0.0:*                           -                   
udp        0      0 127.0.0.54:53           0.0.0.0:*                           -                   
udp        0      0 127.0.0.53:53           0.0.0.0:*                           -                   
udp6       0      0 :::5353                 :::*                                -                   
udp6       0      0 :::56634                :::*                                -                   

**Listening Ports:**
Netid State  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess                                     
udp   UNCONN 0      0        224.0.0.251:5353       0.0.0.0:*    users:(("chrome",pid=3485,fd=57))          
udp   UNCONN 0      0            0.0.0.0:5353       0.0.0.0:*                                               
udp   UNCONN 0      0            0.0.0.0:46527      0.0.0.0:*                                               
udp   UNCONN 0      0         127.0.0.54:53         0.0.0.0:*                                               
udp   UNCONN 0      0      127.0.0.53%lo:53         0.0.0.0:*                                               
udp   UNCONN 0      0               [::]:5353          [::]:*                                               
udp   UNCONN 0      0               [::]:56634         [::]:*                                               
tcp   LISTEN 0      4096      127.0.0.54:53         0.0.0.0:*                                               
tcp   LISTEN 0      511          0.0.0.0:54112      0.0.0.0:*    users:(("next-server (v1",pid=5756,fd=62)) 
tcp   LISTEN 0      4096   127.0.0.53%lo:53         0.0.0.0:*                                               
tcp   LISTEN 0      4096       127.0.0.1:11434      0.0.0.0:*                                               
tcp   LISTEN 0      200        127.0.0.1:3306       0.0.0.0:*                                               
tcp   LISTEN 0      4096       127.0.0.1:631        0.0.0.0:*                                               
tcp   LISTEN 0      70         127.0.0.1:33060      0.0.0.0:*                                               
tcp   LISTEN 0      511                *:80               *:*                                               
tcp   LISTEN 0      511                *:54113            *:*    users:(("next-server (v1",pid=5756,fd=108))
tcp   LISTEN 0      4096           [::1]:631           [::]:*                                               

## Disk and Mount Information

### Disk and Mount Information
**All Mounted Filesystems:**
Filesystem      Size  Used Avail Use% Mounted on
tmpfs           1.6G  2.0M  1.6G   1% /run
/dev/sda3       105G   78G   23G  78% /
tmpfs           7.8G   93M  7.7G   2% /dev/shm
tmpfs           5.0M   12K  5.0M   1% /run/lock
efivarfs        128K   95K   29K  77% /sys/firmware/efi/efivars
/dev/sda1       1.1G   32M  1.1G   3% /boot/efi
tmpfs           1.6G  136K  1.6G   1% /run/user/1000
/dev/sdc2        98G   17G   81G  18% /media/sahon/Sarver

**Detailed Mount Information:**
/dev/sda3 on / type ext4 (rw,relatime)
/dev/sda1 on /boot/efi type vfat (rw,relatime,fmask=0022,dmask=0022,codepage=437,iocharset=iso8859-1,shortname=mixed,errors=remount-ro)
/dev/sdc2 on /media/sahon/Sarver type ntfs3 (rw,nosuid,nodev,relatime,uid=1000,gid=1000,iocharset=utf8,uhelper=udisks2)

**Block Devices:**
NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINTS
loop0    7:0    0     4K  1 loop /snap/bare/5
loop1    7:1    0 329.4M  1 loop /snap/code/205
loop2    7:2    0  63.8M  1 loop /snap/core20/2599
loop3    7:3    0  73.9M  1 loop /snap/core22/2111
loop4    7:4    0  73.9M  1 loop /snap/core22/2133
loop5    7:5    0 246.4M  1 loop /snap/firefox/6738
loop6    7:6    0 247.1M  1 loop /snap/firefox/6836
loop7    7:7    0  11.1M  1 loop /snap/firmware-updater/167
loop8    7:8    0   516M  1 loop /snap/gnome-42-2204/202
loop9    7:9    0  91.7M  1 loop /snap/gtk-common-themes/1535
loop10   7:10   0  10.8M  1 loop /snap/snap-store/1248
loop11   7:11   0  10.8M  1 loop /snap/snap-store/1270
loop12   7:12   0  44.4M  1 loop /snap/snapd/23545
loop13   7:13   0  50.8M  1 loop /snap/snapd/25202
loop14   7:14   0   568K  1 loop /snap/snapd-desktop-integration/253
loop15   7:15   0   576K  1 loop /snap/snapd-desktop-integration/315
loop16   7:16   0 516.2M  1 loop /snap/gnome-42-2204/226
sda      8:0    0 111.8G  0 disk 
├─sda1   8:1    0     1G  0 part /boot/efi
├─sda2   8:2    0   3.7G  0 part 
└─sda3   8:3    0   107G  0 part /
sdb      8:16   0   1.8T  0 disk 
├─sdb1   8:17   0  48.8G  0 part 
├─sdb2   8:18   0 976.6G  0 part 
└─sdb3   8:19   0 837.6G  0 part 
sdc      8:32   0 476.9G  0 disk 
├─sdc1   8:33   0    16M  0 part 
├─sdc2   8:34   0  97.6G  0 part /media/sahon/Sarver
└─sdc3   8:35   0 379.3G  0 part 

**Windows Partitions Detection:**
├─sdb1 ntfs           Word-Press 347695187694DBC4                                    
├─sdb2 ntfs           Videos     98C8A21BC8A1F7A0                                    
└─sdb3 ntfs           Music      D694A6D994A6BB7F                                    
├─sdc2 ntfs           Sarver     7E080C0F080BC4DD                       80.7G    17% /media/sahon/Sarver
└─sdc3 ntfs                      D886089886087970                                    

## EFI/UEFI and Boot Configuration

### EFI/UEFI and Boot Configuration
**Boot Mode:**
UEFI Mode (EFI directory exists)

**EFI Variables (if available):**
BootCurrent: 0024
Timeout: 1 seconds
BootOrder: 0001,0000,0022,0021,0024
Boot0000* Ubuntu	HD(1,GPT,a724900f-770a-4a7f-af55-cbb18e60a6cb,0x800,0x219800)/File(\EFI\ubuntu\shimx64.efi)
Boot0001* Windows Boot Manager	HD(1,GPT,a724900f-770a-4a7f-af55-cbb18e60a6cb,0x800,0x219800)/File(\EFI\Microsoft\Boot\bootmgfw.efi)57494e444f5753000100000088000000780000004200430044004f0042004a004500430054003d007b00390064006500610038003600320063002d0035006300640064002d0034006500370030002d0061006300630031002d006600330032006200330034003400640034003700390035007d00000033000100000010000000040000007fff0400
Boot0021* UEFI OS	HD(1,GPT,a724900f-770a-4a7f-af55-cbb18e60a6cb,0x800,0x219800)/File(\EFI\BOOT\BOOTX64.EFI)
Boot0022* Hard Drive 	BBS(HD,,0x0)0000474f00004e4f87000000010000004f0041007000610063006500720020004100530033003400300020003100320030004700420000000501090002000000007fff040001043e00ef47642dc93ba041ac194d51d01b4ce635004b0037003200370037003000520030003000300033002000370020002000200020002000200000007fff04000000424f00004e4f81000000010000004f0054004f00530048004900420041002000480044005700440032003200300000000501090002000000007fff040001043e00ef47642dc93ba041ac194d51d01b4ce62000200020002000200020002000200030003800310039003000530049004b00430053004800410000007fff04000000424f00004e4f79000000010000004f004100440041005400410020005300550036003500300000000501090002000000007fff040001043e00ef47642dc93ba041ac194d51d01b4ce650003200380030004c0032003600510047004800540052002000200020002000200020002000200000007fff04000000424f
Boot0024* ubuntu	HD(1,GPT,a724900f-770a-4a7f-af55-cbb18e60a6cb,0x800,0x219800)/File(\EFI\Ubuntu\grubx64.efi)

**GRUB Configuration:**
# If you change this file, run 'update-grub' afterwards to update
# /boot/grub/grub.cfg.
# For full documentation of the options in this file, see:
#   info -f grub -n 'Simple configuration'

GRUB_DEFAULT=0
GRUB_TIMEOUT_STYLE=hidden
GRUB_TIMEOUT=0
GRUB_DISTRIBUTOR=`( . /etc/os-release; echo ${NAME:-Ubuntu} ) 2>/dev/null || echo Ubuntu`
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash"
GRUB_CMDLINE_LINUX=""

# If your computer has multiple operating systems installed, then you
# probably want to run os-prober. However, if your computer is a host
# for guest OSes installed via LVM or raw disk devices, running
# os-prober can cause damage to those guest OSes as it mounts
# filesystems to look for things.
#GRUB_DISABLE_OS_PROBER=false

# Uncomment to enable BadRAM filtering, modify to suit your needs
# This works with Linux (no patch required) and with any kernel that obtains
# the memory map information from GRUB (GNU Mach, kernel of FreeBSD ...)
#GRUB_BADRAM="0x01234567,0xfefefefe,0x89abcdef,0xefefefef"

# Uncomment to disable graphical terminal
#GRUB_TERMINAL=console

# The resolution used on graphical terminal
# note that you can use only modes which your graphic card supports via VBE
# you can see them in real GRUB with the command `vbeinfo'
#GRUB_GFXMODE=640x480

# Uncomment if you don't want GRUB to pass "root=UUID=xxx" parameter to Linux
#GRUB_DISABLE_LINUX_UUID=true

# Uncomment to disable generation of recovery mode menu entries
#GRUB_DISABLE_RECOVERY="true"

# Uncomment to get a beep at grub start
#GRUB_INIT_TUNE="480 440 1"

## Project Directory Structure and Dependencies

### Project Directory Structure and Dependencies
**Project Directory Contents:**
total 492
drwxr-xr-x  8 sahon sahon   4096 Sep 25 10:24 .
drwxr-xr-x 11 sahon sahon   4096 Sep 25 10:07 ..
drwxr-xr-x  2 sahon sahon   4096 Sep 25 10:01 admin
-rw-rw-r--  1 sahon sahon   2775 Sep 24 18:19 agent rules.md
-rw-rw-r--  1 sahon sahon 118739 Sep 24 20:21 cmd.html
drwxrwxr-x  4 sahon sahon   4096 Sep 25 10:04 config
-rw-rw-r--  1 sahon sahon   4384 Sep 24 19:30 CURSOR_AI_SETUP.md
drwxrwxr-x  3 sahon sahon   4096 Sep 25 10:04 data
-rwxrwxr-x  1 sahon sahon  10383 Sep 25 10:24 deep_audit.sh
drwxrwxr-x 12 sahon sahon   4096 Sep 25 10:04 Extension
-rw-rw-r--  1 sahon sahon 160816 Sep 25 09:49 index.html
-rw-rw-r--  1 sahon sahon   3927 Sep 24 18:28 integration_test.py
drwxrwxr-x  2 sahon sahon   4096 Sep 25 10:04 logs
-rw-rw-r--  1 sahon sahon  27870 Sep 25 09:37 main_server.py
-rw-rw-r--  1 sahon sahon  32416 Sep 24 19:13 monitoring_dashboard.html
-rw-rw-r--  1 sahon sahon   8162 Sep 24 21:05 README.md
-rw-rw-r--  1 sahon sahon    117 Sep 24 18:25 requirements.txt
drwxrwxr-x  2 sahon sahon   4096 Sep 25 10:04 scripts
-rw-rw-r--  1 sahon sahon  36439 Sep 24 19:18 system_report.html
-rw-rw-r--  1 sahon sahon  13431 Sep 24 18:11 worklist.md
-rw-rw-r--  1 sahon sahon   6176 Sep 24 23:54 ZOMBIECODER_LAUNCHER.bat
-rw-rw-r--  1 sahon sahon  22152 Sep 25 09:47 zombiecoder_smart_launcher.py

**Python Dependencies:**
requirements.txt found:
fastapi==0.104.1
uvicorn[standard]==0.24.0
httpx==0.25.2
pydantic==2.5.0
pyyaml==6.0.1
python-multipart==0.0.6

**Node.js Dependencies:**
package.json found:
{
  "name": "hello-zombie",
  "displayName": "Hello Zombie",
  "description": "Local AI coding assistant powered by Ollama",
  "version": "1.0.0",
  "publisher": "Sahon Srabon",
  "engines": {
    "vscode": "^1.74.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/sahonsrabon/hello-zombie"
  },
  "categories": [
    "Other",
    "Machine Learning",
    "Snippets"
  ],
  "keywords": [
    "ai",
    "ollama",
    "coding-assistant",
    "local-ai"
  ],
  "activationEvents": [
    "onCommand:helloZombie.startChat",
    "onCommand:helloZombie.openPanel"
  ],
  "main": "./out/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "helloZombie.startChat",
        "title": "Start Chat with Hello Zombie",
        "category": "Hello Zombie"
      },
      {
        "command": "helloZombie.openPanel",
        "title": "Open Hello Zombie Panel",
        "category": "Hello Zombie"
      }
    ],
    "menus": {
      "commandPalette": [
        {
          "command": "helloZombie.startChat",
          "when": "true"
        },
        {
          "command": "helloZombie.openPanel",
          "when": "true"
        }
      ],
      "editor/context": [
        {
          "command": "helloZombie.startChat",
          "group": "helloZombie",
          "when": "editorHasSelection"
        }
      ]
    },
    "views": {
      "explorer": [
        {
          "id": "helloZombiePanel",
          "name": "Hello Zombie",
          "when": "true"
        }
      ]
    },
    "configuration": {
      "title": "Hello Zombie",
      "properties": {
        "helloZombie.serverUrl": {
          "type": "string",
          "default": "http://localhost:12346",
          "description": "Main server URL for Hello Zombie"
        },
        "helloZombie.requireConfirmation": {
          "type": "boolean",
          "default": true,
          "description": "Require user confirmation before executing terminal commands"
        }
      }
    }
  },
  "scripts": {
    "vscode:prepublish": "npm run compile",
    "compile": "tsc -p ./",
    "watch": "tsc -watch -p ./",
    "pretest": "npm run compile && npm run lint",
    "lint": "eslint src --ext ts",
    "test": "node ./out/test/runTest.js",
    "package": "vsce package"
  },
  "devDependencies": {
    "@types/vscode": "^1.74.0",
    "@types/node": "16.x",
    "@typescript-eslint/eslint-plugin": "^5.45.0",
    "@typescript-eslint/parser": "^5.45.0",
    "eslint": "^8.28.0",
    "typescript": "^4.9.4",
    "@vscode/test-electron": "^2.2.0",
    "vsce": "^2.15.0"
  },
  "dependencies": {}
}
**Installed Python Packages:**
Package                Version
---------------------- --------------
asgiref                3.7.2
attrs                  23.2.0
Babel                  2.10.3
bcc                    0.29.1
blinker                1.7.0
Brlapi                 0.8.5
certifi                2023.11.17
chardet                5.2.0
click                  8.1.6
cloud-init             25.1.4
colorama               0.4.6
command-not-found      0.3
configobj              5.0.8
cryptography           41.0.7
cupshelpers            1.0
dbus-python            1.3.2
defer                  1.0.6
distro                 1.9.0
pip not available or no packages installed

**Node.js Global Packages:**
/usr/local/lib
└── (empty)


## Ollama Models Status

### Ollama Models Status
**Ollama Installation:** ✅ Installed
**Ollama Version:** ollama version is 0.11.8

**Currently Installed Models:**
NAME                       ID              SIZE      MODIFIED   
qwen2.5-coder:1.5b-base    02e0f2817a89    986 MB    4 days ago    
llama3.1:8b                46e0c10c039e    4.9 GB    7 days ago    

**Model Pull Attempts:**
✅ gemma:2b - Successfully pulled
✅ deepseek-coder:1.3b - Successfully pulled

**Model Testing:**
Hello! 👋 It's nice to meet you as well. What can I do for you today?

✅ gemma:2b - Model responds correctly

## Server and Service Status

### Server and Service Status
**Python HTTP Servers:**
No Python HTTP servers running

**Node.js Development Servers:**
sahon       6084  0.0  0.5 1216114620 81480 ?    Sl   10:09   0:00 /tmp/.mount_Cursor8i6HHq/usr/share/cursor/cursor /home/sahon/.cursor/extensions/ms-edgedevtools.vscode-edge-devtools-2.1.9/node_modules/vscode-webhint/dist/src/server.js /home/sahon/.config/Cursor/User/globalStorage/ms-edgedevtools.vscode-edge-devtools Microsoft Edge Tools --node-ipc --clientProcessId=5756

**Port 3000 (Common React/Next.js):**
Port 3000 not in use

**Port 5000 (Common Flask):**
Port 5000 not in use

**Port 8000 (Common Django):**
Port 8000 not in use

**Project Main Server Status:**
main_server.py not running

## System Services

### System Services
**Docker Status:**
inactive
Docker not installed or not running

**SSH Service:**
inactive
SSH service not available

**Network Manager:**
active

## System Performance

### System Performance
**CPU Usage:**
%Cpu(s): 63.0 us, 13.0 sy,  0.0 ni, 23.9 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st 

**Memory Usage:**
               total        used        free      shared  buff/cache   available
Mem:            15Gi       8.6Gi       149Mi       736Mi       7.6Gi       6.9Gi
Swap:          4.0Gi       256Ki       4.0Gi

**Disk I/O:**
Linux 6.14.0-29-generic (sahon-All-Series) 	09/25/2025 	_x86_64_	(4 CPU)

avg-cpu:  %user   %nice %system %iowait  %steal   %idle
          22.95    1.58    8.31    3.19    0.00   63.96

Device             tps    kB_read/s    kB_wrtn/s    kB_dscd/s    kB_read    kB_wrtn    kB_dscd
loop0             0.01         0.01         0.00         0.00         17          0          0
loop1             0.04         0.80         0.00         0.00       1316          0          0
loop10            0.03         0.21         0.00         0.00        347          0          0
loop11            0.19         6.80         0.00         0.00      11210          0          0
loop12            0.03         0.21         0.00         0.00        347          0          0
loop13            0.45        16.52         0.00         0.00      27255          0          0
loop14            0.01         0.04         0.00         0.00         58          0          0
loop15            0.02         0.20         0.00         0.00        332          0          0
loop16            2.12        39.61         0.00         0.00      65334          0          0
loop2             0.03         0.22         0.00         0.00        361          0          0
loop3             0.03         0.66         0.00         0.00       1082          0          0
loop4             0.27         3.39         0.00         0.00       5591          0          0
loop5             0.03         0.66         0.00         0.00       1085          0          0
loop6             1.03        53.69         0.00         0.00      88571          0          0
loop7             0.03         0.23         0.00         0.00        381          0          0
loop8             1.11        13.53         0.00         0.00      22325          0          0
loop9             1.72         7.51         0.00         0.00      12394          0          0
sda             210.71      2896.55      3064.62         0.00    4778065    5055305          0
sdb               5.12        25.15        39.74         0.00      41484      65556          0
sdc               1.00        21.65        39.74         0.00      35716      65548          0



**Load Average:**
 10:30:21 up 27 min,  1 user,  load average: 3.21, 2.45, 1.81

## Security Analysis

### Security Analysis
**Current User Groups:**
sahon adm cdrom sudo dip plugdev users lpadmin ollama

**Sudo Access:**
No sudo access or password required

**Project Directory Permissions:**
drwxr-xr-x 8 sahon sahon 4096 Sep 25 10:24 /home/sahon/Desktop/Hello Zombie

**Firewall Status:**
UFW not available

## Network Information

### Network Information
**Network Interfaces:**
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host noprefixroute 
       valid_lft forever preferred_lft forever
2: enp3s0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 7c:10:c9:a0:a6:dc brd ff:ff:ff:ff:ff:ff
    inet 192.168.1.218/24 brd 192.168.1.255 scope global dynamic noprefixroute enp3s0
       valid_lft 84759sec preferred_lft 84759sec
    inet6 fe80::7e10:c9ff:fea0:a6dc/64 scope link 
       valid_lft forever preferred_lft forever

**Routing Table:**
default via 192.168.1.1 dev enp3s0 proto dhcp src 192.168.1.218 metric 100 
192.168.1.0/24 dev enp3s0 proto kernel scope link src 192.168.1.218 metric 100 

**DNS Configuration:**
# This is /run/systemd/resolve/stub-resolv.conf managed by man:systemd-resolved(8).
# Do not edit.
#
# This file might be symlinked as /etc/resolv.conf. If you're looking at
# /etc/resolv.conf and seeing this text, you have followed the symlink.
#
# This is a dynamic resolv.conf file for connecting local clients to the
# internal DNS stub resolver of systemd-resolved. This file lists all
# configured search domains.
#
# Run "resolvectl status" to see details about the uplink DNS servers
# currently in use.
#
# Third party programs should typically not access this file directly, but only
# through the symlink at /etc/resolv.conf. To manage man:resolv.conf(5) in a
# different way, replace this symlink by a static file or a different symlink.
#
# See man:systemd-resolved.service(8) for details about the supported modes of
# operation for /etc/resolv.conf.

nameserver 127.0.0.53
options edns0 trust-ad
search .

---
**Report Generated:** 2025-09-25 10:30:21
**Total Execution Time:** 367 seconds
