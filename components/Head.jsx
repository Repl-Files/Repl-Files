import SetHead from "next/head"

const Head = ({titleContent='', description='Repl Files - Eassy file hosting. Free. Forever', avatar='./favicon.ico'}) => {
    return <SetHead>
        <title>{titleContent} | Repl Files</title>
        <meta name="description" content={description} />
        <link rel="icon" href={avatar} />
    </SetHead>
}

export default Head