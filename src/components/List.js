import ListItem from "./ListItem"
export default function List({ items, directory, date, itemType }) {
    return (<>
        <ul className="">
            {
                items.length > 0 ?
                    items.map((item) => (
                        <ListItem key={item.id} item={item} title={item.name} to={directory + item.id} date={date} />
                    )) :
                    <p>表示する{itemType}がありません。</p>
            }
        </ul>
    </>)
}