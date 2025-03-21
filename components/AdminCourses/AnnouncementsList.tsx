import { Card, Typography, IconButton, Fade } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface Announcement {
  _id: number;
  title: string;
  createdAt: string;
  description: string;
}

interface AnnouncementsListProps {
  announcements: Announcement[];
  onAnnouncementClick: (announcement: Announcement) => void;
  onAnnouncementDelete: (announcementId: number) => void;
}

const cardColors = ["#0DB7F0", "#AB47BC", "#FA9F1B", "#F06292"];

const AnnouncementsList = ({
  announcements,
  onAnnouncementClick,
  onAnnouncementDelete,
}: AnnouncementsListProps) => {
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
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
            onClick={() => onAnnouncementClick(announcement)}
          >
            <div>
              <Typography variant="h6" color="white">
                {announcement.title}
              </Typography>
              <Typography variant="body2" color="white">
                {announcement.description}
              </Typography>
            </div>
            <IconButton
              onClick={(e) => {
                e.stopPropagation(); // prevent triggering the card click
                onAnnouncementDelete(announcement._id);
              }}
              size="small"
            >
              <DeleteIcon sx={{ color: "white" }} />
            </IconButton>
          </Card>
        </Fade>
      ))}
    </div>
  );
};

export default AnnouncementsList;
