import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import './home.css'

export default function Home() {
  return (
    <div id="home" style={{display: 'flex', flexDirection: 'row', padding: 10, margin: 10, justifyContent: 'center', alignItems: 'center'}}>
      <Card sx={{ maxWidth: 345, margin: 5, '&:hover': { transform: 'scale(1.05)', transition: '0.8s ease-in-out' }}}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image="public/compoents/Discover.png"
          alt="discover"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Discover
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Discover the world with our built-in map feature to locate any place
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>

    <Card sx={{ maxWidth: 345, margin: 5, '&:hover': { transform: 'scale(1.05)', transition: '0.8s ease-in-out' }}}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image="@/components/AI.png"
          alt="artificial intelligence"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Artificial Intelligence
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ask our custom <b> artificial intelligence</b> about breathtaking places
            around the world
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>

    <Card sx={{ maxWidth: 345, margin: 5, '&:hover': { transform: 'scale(1.05)', transition: '0.8s ease-in-out' }}}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image="@/components/Travel.png"
          alt="travel"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Travel
          </Typography>
          <Typography variant="body2" color="text.secondary">
            With our upcoming <b>Booking.com</b> API integration, book your dream vacation right here
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
    </div>

    
  );
}