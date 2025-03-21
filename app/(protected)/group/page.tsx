"use client";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSessionCheck from "../../hooks/auth";
import GroupCodePopup from "@/components/Group/GroupCodePopup";
import CreateGroupPopup from "@/components/Group/CreateGroupPopup";

type Session = {
  user: {
    id: string;
    token: string;
  };
  email: string;
  isAdmin: boolean;
};

interface Group {
  _id: string;
  name: string;
}

const GroupsDashboard = () => {
  const PORT = process.env.NEXT_PUBLIC_PORT;
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [openJoinPopup, setOpenJoinPopup] = useState(false);
  const [openCreatePopup, setOpenCreatePopup] = useState(false);

  useSessionCheck(setSession);

  const fetchGroups = async () => {
    if (session) {
      try {
        console.log(session.user.token);
        const response = await fetch(
          `http://localhost:${PORT}/api/groups/allusergrps`,
          {
            headers: { Authorization: `Bearer ${session.user.token}` },
            method: "GET",
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          // data.usergrp is expected to be an array of objects, each with _id and name
          setGroups(data.usergrp);
        } else {
          console.error("Failed to fetch groups");
        }
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [session, openJoinPopup, openCreatePopup]);

  const handleGroupClick = (groupId: string) => {
    // Navigate to the group details page using the group's _id
    router.push(`/group/${groupId}`);
  };

  const handleJoinGroup = async (groupCode: string) => {
    if (session) {
      try {
        const response = await fetch(
          `http://localhost:${PORT}/api/groups/joingroup/${groupCode}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.user.token}`,
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error joining group:", errorData);
        }
      } catch (error) {
        console.error("Network error joining group:", error);
      }
    }
  };

  const handleCreateGroup = async (groupName: string) => {
    if (session) {
      try {
        const response = await fetch(
          `http://localhost:${PORT}/groups/api/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.user.token}`,
            },
            body: JSON.stringify({ name: groupName }),
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error creating group:", errorData);
        }
      } catch (error) {
        console.error("Network error creating group:", error);
      }
    }
  };

  return (
    <div className="bg-[#001D3D] h-full">
      <Box
        className="bg-c2 text-white p-4 flex flex-col items-center"
        sx={{ minHeight: "100vh", width: "100vw" }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: "100vw", mb: 4 }}
        >
          <Typography variant="h4" className="mt-2 mb-4">
            Your Groups
          </Typography>
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenJoinPopup(true)}
              sx={{ mr: 2 }}
            >
              Join Group
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setOpenCreatePopup(true)}
            >
              Create Group
            </Button>
          </Box>
        </Box>
        <Grid
          container
          spacing={4}
          justifyContent="flex-start"
          sx={{ flexGrow: 1 }}
        >
          {groups.map((group) => (
            <Grid
              item
              key={group._id}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              display="flex"
              justifyContent="center"
            >
              <Card
                className="bg-c5 text-white"
                sx={{ width: "100%", height: "200px", cursor: "pointer" }}
                onClick={() => handleGroupClick(group._id)}
              >
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {group.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <GroupCodePopup
          open={openJoinPopup}
          handleClose={() => setOpenJoinPopup(false)}
          onJoinGroup={handleJoinGroup}
        />
        <CreateGroupPopup
          open={openCreatePopup}
          handleClose={() => setOpenCreatePopup(false)}
          onCreateGroup={handleCreateGroup}
        />
      </Box>
    </div>
  );
};

export default GroupsDashboard;
