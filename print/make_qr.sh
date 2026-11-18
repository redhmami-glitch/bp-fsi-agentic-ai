#!/bin/zsh
# Usage : print/make_qr.sh https://adresse-du-site/   (régénère les QR et l'image téléphone)
set -e
cd "$(dirname $0)/.."
BASE="$1"; URL="${BASE}?src=forum"
"/private/tmp/claude-501/-Users-redouanhmami--claude-spares-spare-RQMzbA/88f772e0-c4e3-4345-a16f-5e945bfaa324/scratchpad/venv/bin/python" -c "import segno,sys; q=segno.make(sys.argv[1],error='m',boost_error=False); q.save('assets/qr.svg',scale=10,border=2,dark='#000000'); q.save('assets/qr.png',scale=24,border=3,dark='#000000'); print('QR v',q.version,sys.argv[1])" "$URL"
SHORT=$(echo "$BASE" | sed -E 's#^https?://##; s#/$##')
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --disable-gpu --hide-scrollbars --user-data-dir="/private/tmp/claude-501/-Users-redouanhmami--claude-spares-spare-RQMzbA/88f772e0-c4e3-4345-a16f-5e945bfaa324/scratchpad/chrome-prof" --window-size=390,844 --force-device-scale-factor=3 --virtual-time-budget=4000 --screenshot="$PWD/print/QR-telephone.png" "file://$PWD/print/phone.html?u=$SHORT" 2>/dev/null
echo "Image : print/QR-telephone.png"
