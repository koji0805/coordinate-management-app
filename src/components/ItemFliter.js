import { useState } from "react";
import { RadioButton } from "./FormParts";
export const categories = ["すべて", "着物", "帯", "羽織", "半襟", "帯揚げ", "帯締め", "帯留め", "その他"];
// フィルタリングボタンのコンポーネント
function ItemFilter({ selectedCategory, setSelectedCategory }) {

    // 入力フィールドの値を更新
    const handleChange = (e) => {
        const checkedCategory = e.target.value;
        setSelectedCategory(checkedCategory)
    };
    return (
        <>{
            categories.map((category) => (
                <RadioButton
                    key={category}
                    name="category"
                    btnCls="text-left"
                    text={category}
                    value={category}
                    onChange={handleChange}
                    checked={selectedCategory === category}
                />
            ))}
        </>
    );
}

export default ItemFilter;
