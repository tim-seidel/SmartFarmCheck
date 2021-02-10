import React from 'react'
import { View, StyleSheet } from 'react-native'

import URLInterceptingWebview from '../components/URLInterceptingWebview'
import { HeadingText } from './Text'

import { useThemeProvider } from '../ThemeContext'
import { ConstantColors } from '../constants/Colors'


const MeasureView = props => {
    const { colorTheme } = useThemeProvider()
    const measure = props.measure

    function onURLHandler(url) {
        if (props.onURLClicked) {
            props.onURLClicked(url);
        }
    }

    const head = '<html lang="de"><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body {font-size: 110%; font-family: Arial; color: ' + colorTheme.textPrimary + ' } p{text-align: justify; hyphens: auto; }</style></head>'
    var content = '<h2>' + measure.name + '</h2>'
    content += measure.description ?? "<p>Leider wurde noch kein detaillierter Inhalt hinterlegt.</p>"

    measure.resources.forEach(r => {
        switch (r.mime) {
            case "image/jpeg":
            case "image/png":
                const uri = "https://pas.coala.digital/v1/measures/" + measure.uuid + "/resource/" + r.name
                content += "<img style=\"max-width: 100%\" src=\"" + uri + "\"/>" + "<p>Bild: " + r.description + "</>"
        }
    })
    const wrapped = head + '<body>' + content + '</body></html>'

    return (
        <URLInterceptingWebview style={{ backgroundColor: ConstantColors.transparent }} onURLSelected={onURLHandler} source={{ html: wrapped }} />
       
    )
}

const styles = StyleSheet.create({
    heading: {
        marginTop: 4
    }
})

export default MeasureView
