// components/UserCourses/PeopleList.tsx
"use client";

import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export interface Member {
  memberid: string;
  name: string;
  rank: string;
}

interface PeopleListProps {
  members: Member[];
  currentUserRole: string;
  onChangeMembership: (memberId: string, newRole: string) => void;
  onDeleteMember: (memberId: string) => void;
}

export default function PeopleList({
  members,
  currentUserRole,
  onChangeMembership,
  onDeleteMember,
}: PeopleListProps) {
  if (members.length === 0) {
    return <Typography>No members yet.</Typography>;
  }

  return (
    <List>
      {members.map((m) => (
        <ListItem key={m.memberid} divider>
          <ListItemAvatar>
            <Avatar>{m.name[0]}</Avatar>
          </ListItemAvatar>

          <ListItemText
            primary={m.name}
            secondary={`Role: ${m.rank}`}
          />

          <ListItemSecondaryAction>
            {currentUserRole === "Creator" && m.rank !== "Creator" && (
              <FormControl size="small" sx={{ mr: 1, minWidth: 100 }}>
                <Select
                  value={m.rank}
                  onChange={(e) =>
                    onChangeMembership(m.memberid, e.target.value as string)
                  }
                >
                  <MenuItem value="Member">Member</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </Select>
              </FormControl>
            )}
            {((currentUserRole === "Creator" && m.rank !== "Creator") ||
              (currentUserRole === "Admin" && m.rank === "Member")) && (
              <IconButton
                edge="end"
                onClick={() => onDeleteMember(m.memberid)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            )}
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
}
