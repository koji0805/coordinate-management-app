export const colorMap = {
    "red-600": "赤",
    "orange-400": "オレンジ",
    "yellow-300": "黄色",
    "green-600": "緑",
    "blue-600": "青",
    "purple-600": "紫",
    "cyan-200": "水色",
    "lime-200": "黄緑",
    "pink-400": "ピンク",
    "slate-400": "灰色",
    "slate-200": "シルバー",
    "[#e2d06e]": "ゴールド",
    "stone-950": "黒",
    "white": "白"
    // 色を追加したら、src/safelist.cssかsafelist.jsに追加する 
};

export function getColorText(color) {
    return colorMap[color] || color;
}