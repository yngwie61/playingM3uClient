## init処理(viteあり)

> tailwindのビルドはvite.config.tsに含めている。
> index.css内で @import "tailwindcss"; 実行

yarn devで開発用サーバを起動する

yarn buildで本番用ファイルを出力する

yarn previewで本番ファイルに対して簡易サーバでアクセスする

## init処理(viteなし)

明示的にコンパイルする方法(現状のファイル構成ではvite移行済みのため不要)

```

npx tailwindcss init
npx tailwindcss -c ./tailwind.config.js -i ./tailwindcss/style.css -o src/output.css

```