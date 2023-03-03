import { LoadingButton } from "@mui/lab";
import { AppBar, Box, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";

const API_WEATHER = `https://api.weatherapi.com/v1/current.json?key=${import.meta.env.VITE_API_KEY}&q=`

export default function App() {

  const initialErrorState = {
    error: false,
    message: ''
  }

  const initialWeatherState = {
    city: '',
    country: '',
    temp: '',
    condition: '',
    icon: '',
    conditionText: ''
  }

  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(initialErrorState)
  const [weather, setWeather] = useState(initialWeatherState)

  const handelChange = evt => {
    setCity(evt.target.value)
  }

  const handeSubmit = async evt => {
    evt.preventDefault()
    setLoading(true)
    setError(initialErrorState)
    try {
      if(!city.trim()) throw { message: 'A City is required!'}
      const response = await fetch(`${API_WEATHER}${city}`)
      const data = await response.json()

      if(data.error) throw { message: data.error.message}

      setWeather({
        city: data.location.name,
        country: data.location.country,
        temp: data.current.temp_c,
        condition: data.current.condition.code,
        icon: data.current.condition.icon,
        conditionText: data.current.condition.text
      })
    } catch (error) {
      setError({
          error: true, 
          message: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container
      maxWidth='xs'
      sx={{mt:2}}
    >
      <Typography 
        variant='h3'
        component='h1'
        align='center'
        gutterBottom
      >Weather App</Typography>
      <Box
        sx={{display:'grid', gap: 2}}
        component='form'
        autoComplete='off'
        onSubmit={handeSubmit}
      >
        <TextField 
          id='city'
          label='city'
          variant='outlined'
          size='small'
          required
          value={city}
          onChange={handelChange}
          error={error.error}
          helperText={error.message}
        />
        <LoadingButton
          type='submit'
          variant='contained'
          loading={loading}
          loadingIndicator='Searching...'
        >Search</LoadingButton>
      </Box>
      {weather.city && <Box
        sx={{mt: 2, display: 'grid', gap: 2, textAlign: 'center'}}
      >
        <Typography vairant='h4' component='h2'>{weather.city}, {weather.country}</Typography>
        <Box
          component='img'
          alt={weather.conditionText}
          src={weather.icon}
          sx={{ margin: '0 auto'}}
        ></Box>
        <Typography variant='h5' component='h3'>
          {weather.temp} °C
        </Typography>
        <Typography variant='h6' component='h4'>
          {weather.conditionText}
        </Typography>
      </Box>
      }
      <Typography
        textAlign='center'
        sx={{mt: 2, fontSize: '10px'}}
      >
        Powered by:{' '}
        <a 
          href='https://www.weatherapi.com/'
          title='Weather API'
        > WeatherAPI.com</a>
      </Typography>
    </Container>
  )
}