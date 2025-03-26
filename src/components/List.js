import ListItem from "./ListItem"
export default function List({ items, directory, date }) {
    return (<>
        <ul className="">
            {items.map((item) => (
                <ListItem key={item.id} item={item} title={item.name} to={directory + item.id} date={date} />
            ))}
        </ul>
    </>)
}