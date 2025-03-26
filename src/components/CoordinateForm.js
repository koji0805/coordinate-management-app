export default function CoordinateForm({ mode, coorinate }) {
    return (<>
        {mode === "new" ?
            <>
                <p>作成</p>
            </>
            :
            <>
                <p>編集</p>
            </>
        }
    </>);
}