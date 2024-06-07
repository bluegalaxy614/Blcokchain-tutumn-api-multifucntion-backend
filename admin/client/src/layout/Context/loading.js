import { useState, createContext } from 'react'

const LoadingContext = createContext({
    loadingCount: 0,
    showLoading: () => { },
    closeLoading: () => { }
})

/* eslint-disable */
const LoadingProvider = ({ children }) => {
    const showLoading = () => {
        toggleLoading(prevState => {
            return {
                ...prevState,
                loadingCount: prevState.loadingCount + 1
            }
        })
    }

    const hideLoading = () => {
        toggleLoading(prevState => {
            return {
                ...prevState,
                loadingCount:
                    prevState.loadingCount > 0 ? prevState.loadingCount - 1 : 0
            }
        })
    }
    const loadingState = {
        loadingCount: 0,
        showLoading,
        hideLoading
    }
    const [loading, toggleLoading] = useState(loadingState)
    /* eslint-enable */

    return (
        <LoadingContext.Provider value={loading}>
            {children}
        </LoadingContext.Provider>
    )
}

export { LoadingContext, LoadingProvider }