import React from "react";
import { Container, Grid, Card, CardContent, Typography, CardMedia, Avatar, CardHeader, IconButton } from "@mui/material";
import { Favorite, Share } from "@mui/icons-material";

const articles = [
  {
    title: "Article 1",
    description: "This is a short description for article 1.",
    imageUrl: "https://via.placeholder.com/400x200",
    author: "Author 1",
    date: "July 28, 2024",
  },
  {
    title: "Article 2",
    description: "This is a short description for article 2.",
    imageUrl: "https://via.placeholder.com/400x200",
    author: "Author 2",
    date: "July 27, 2024",
  },
  {
    title: "Article 3",
    description: "This is a short description for article 3.",
    imageUrl: "https://via.placeholder.com/400x200",
    author: "Author 3",
    date: "July 26, 2024",
  },
];

const ArticleCard = ({ article }) => (
  <Card
    sx={{
      margin: 2,
      transition: "transform 0.2s",
      "&:hover": {
        transform: "scale(1.05)",
      },
    }}
  >
    <CardHeader
      avatar={
        <Avatar aria-label="author" sx={{ backgroundColor: "primary.main" }}>
          {article.author[0]}
        </Avatar>
      }
      action={
        <IconButton sx={{ color: "primary.main" }} aria-label="settings">
          <Share />
        </IconButton>
      }
      title={article.author}
      subheader={article.date}
    />
    <CardMedia component="img" height="200" image={article.imageUrl} alt={article.title} />
    <CardContent>
      <Typography variant="h6" component="h2">
        {article.title}
      </Typography>
      <Typography variant="body2" color="textSecondary" component="p">
        {article.description}
      </Typography>
      <IconButton sx={{ color: "primary.main" }} aria-label="add to favorites">
        <Favorite />
      </IconButton>
    </CardContent>
  </Card>
);

const SampleComponent = () => (
  <Container sx={{ padding: 4 }}>
    <Grid container spacing={4}>
      {articles.map((article, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <ArticleCard article={article} />
        </Grid>
      ))}
    </Grid>
  </Container>
);

export default SampleComponent;
