import { useContext } from 'react'
import Box from "@mui/material/Box"
import { LoadingContext } from "../layout/Context/loading"
import Lottie from 'react-lottie-player'
import lottieJson from "../hooks/loader.json"

const ContextLoading = () => {
    const { loadingCount } = useContext(LoadingContext)
    return (
        <Box>
            {
                loadingCount > 0 ?
                    <Box className="loading-container">
                        <Lottie
                            speed={1}
                            animationData={lottieJson}
                            play
                            style={{ width: "200px", height: "200px" }}
                        />
                    </Box>
                    : null
            }
        </Box>
    )
}

export default ContextLoading