import ListItem from "../list/ListItem"
export default function List({ items, directory, itemType }) {
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