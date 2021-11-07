// React import
import React from 'react'
import {render} from 'react-dom'

// APP component import
import App from './components/app'

// Global styles import
import './global.scss'

// Chackra UI import
import {ChakraProvider} from "@chakra-ui/react"

// React INIT
render(
    // You can change theme in ChakraProvider. Example: <ChakraProvider theme='your_theme'>
    <ChakraProvider>
        <App/>
    </ChakraProvider>,
    document.getElementById('root')
)