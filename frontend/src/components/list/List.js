import ListItem from "../list/ListItem"
export default function List({ items, directory, itemType }) {
    let listItems = items;
    if (itemType === "コーディネート") {
        listItems.sort(function (a, b) {
            if (a.day < b.day) return 1;
            if (a.day > b.day) return -1;
            return 0;
        });
    } else { // アイテム
        listItems.sort(function (a, b) {
            if (a.updated_at < b.updated_at) return 1;
            if (a.updated_at > b.updated_at) return -1;
            return 0;
        });
    }
    return (<>
        <ul className="">
            {
                items.length > 0 ?
                    items.map((item) => (
                        <ListItem key={item.id} item={item} title={item.name} to={directory + item.id} date={item.day && item.day} />
                    )) :
                    <p>表示する{itemType}がありません。</p>
            }
        </ul>
    </>)
}