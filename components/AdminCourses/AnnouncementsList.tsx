import { Card, Typography, Fade } from "@mui/material";

interface Announcement {
  _id: number;
  title: string;
  createdAt: string;
  description: string;
}

interface AnnouncementsListProps {
  announcements: Announcement[];
  onAnnouncementClick: (announcement: Announcement) => void;
}

const cardColors = ["#0DB7F0", "#AB47BC", "#FA9F1B", "#F06292"];

const AnnouncementsList = ({ announcements, onAnnouncementClick }: AnnouncementsListProps) => {
  return (
    <div>
      {announcements.map((announcement, index) => (
        <Fade 
          in={true} 
          timeout={500} 
          style={{ transitionDelay: `${index * 200}ms` }} 
          key={announcement._id}
        >
          <Card
            sx={{
              backgroundColor: cardColors[index % cardColors.length],
              marginBottom: 2,
              padding: 2,
              cursor: "pointer"
            }}
            onClick={() => onAnnouncementClick(announcement)}
          >
            <Typography variant="h6" color="white">
              {announcement.title}
            </Typography>
            <Typography variant="body2" color="white">
              {announcement.description}
            </Typography>
          </Card>
        </Fade>
      ))}
    </div>
  );
};

export default AnnouncementsList;
