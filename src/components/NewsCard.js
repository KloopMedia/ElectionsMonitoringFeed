import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    // height: 0,
    // paddingTop: '56.25%', // 16:9
    height: "100%",
    //paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function NewsCard(props) {

  //console.log(props.news)
  let isImage = false
  let isVideo = false

  console.log('FILES DEBUG')
  console.log(props.news)

  //console.log(props.news.fileInfo)
  if (Object.keys(props.news.fileInfo).length > 0){

    if (props.news.fileInfo.isImage){
      isImage = true
    }else{
      isVideo = true
    } 
  }

  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const createParagraph = (text, index) => {

    if (index==0){
      return(
        <Typography paragraph><b>{text}</b></Typography>
      );
    }else{
      return(
        <Typography paragraph>{text}</Typography>
      );
    }
    
  }

  const descriptionLastIndex = props.news.description.length - 1

  const createDescriptionParagraph = (text, index) => {

    if (index==descriptionLastIndex){
      return(
        <Typography variant="body2" color="textSecondary" component="p">{text}</Typography>
      );
    }else{
      return(
        <Typography variant="body2" color="textSecondary" component="p"><b>{text}</b></Typography>
      );
    }
    
  }

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            ?
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={props.news.title}
        subheader={props.news.date}
      />
      {isImage ? <CardMedia
        className={classes.media}
        image={props.news.fileInfo.public_url}
        title={props.news.fileInfo.filename}
      />
        : <div></div>
      }
      {isVideo ? <CardMedia
        component='iframe'
        title={props.news.fileInfo.filename}
        //src='https://www.youtube.com/embed/FEG31rDg2TU'
        src={props.news.fileInfo.public_url}
        />
        : <div></div>
      }
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {Object.keys(props.news.description).map(index => ( 
            createDescriptionParagraph(props.news.description[index], index)
          ))}
        </Typography>
      </CardContent>
      <CardActions disableSpacing> 
        {/* <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton> */}
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph></Typography>

          {Object.keys(props.news.violations).map(index => (
              Object.keys(props.news.violations[index]).map(indexInner => (  

                createParagraph(props.news.violations[index][indexInner], indexInner)
            
              ))

            ))}          
          <Typography></Typography>
          
        </CardContent>
      </Collapse>
    </Card>
  );
}
