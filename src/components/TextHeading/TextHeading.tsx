import React from 'react'

interface Props {
    title: string
    subTitle: string
}

const TextHeading: React.FC<Props> = ({ title, subTitle }) => {
    return (
        <>
            <div className="heading flex items-center justify-center w-full">
                <div className="content xl:w-1/2 sm:w-2/3 flex flex-col items-center justify-center">
                    <div className="heading3 text-center">{title}</div>
                    <div className="body2 text-variant1 text-center sm:mt-3 mt-2">{subTitle}</div>
                </div>
            </div>
        </>
    )
}

export default TextHeading