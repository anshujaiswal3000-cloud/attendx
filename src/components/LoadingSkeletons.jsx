import React from "react";
import { Grid, Card, Skeleton, Box } from "@mui/material";

export function DashboardSkeleton() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Greeting Skeleton */}
      <Skeleton width="40%" height={50} sx={{ mb: 1 }} />
      <Skeleton width="20%" height={24} sx={{ mb: 4 }} />

      <Grid container spacing={3}>
        {/* Overall progress card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center", borderRadius: "18px" }}>
            <Skeleton variant="circular" width={140} height={140} sx={{ mb: 2 }} />
            <Skeleton width="60%" height={30} />
          </Card>
        </Grid>

        {/* Stats card */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={6} md={3} key={i}>
                <Card sx={{ p: 2, borderRadius: "18px" }}>
                  <Skeleton width="40%" height={20} sx={{ mb: 1 }} />
                  <Skeleton width="80%" height={35} />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Today's classes */}
        <Grid item xs={12}>
          <Skeleton width="30%" height={35} sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {[1, 2, 3].map((i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card sx={{ p: 3, borderRadius: "18px" }}>
                  <Skeleton width="70%" height={30} sx={{ mb: 1 }} />
                  <Skeleton width="40%" height={20} sx={{ mb: 2 }} />
                  <Box display="flex" gap={1}>
                    <Skeleton width={80} height={35} />
                    <Skeleton width={80} height={35} />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export function SubjectListSkeleton() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Skeleton width="30%" height={40} />
        <Skeleton variant="circular" width={56} height={56} />
      </Box>
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Grid item xs={12} sm={6} md={4} key={i}>
            <Card sx={{ p: 3, borderRadius: "18px" }}>
              <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
                <Skeleton width="60%" height={28} />
                <Skeleton variant="circular" width={32} height={32} />
              </Box>
              <Skeleton width="40%" height={20} sx={{ mb: 3 }} />
              <Skeleton variant="rectangular" height={10} sx={{ borderRadius: "5px", mb: 2 }} />
              <Box display="flex" justifyContent="space-between" sx={{ mb: 3 }}>
                <Skeleton width="20%" height={20} />
                <Skeleton width="20%" height={20} />
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Skeleton width="45%" height={36} />
                <Skeleton width="45%" height={36} />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
