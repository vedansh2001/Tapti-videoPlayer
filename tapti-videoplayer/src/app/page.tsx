"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

type PlaylistData = {
  title: string;
  description: string;
  channelTitle: string;
  thumbnails: {
    high: { url: string };
  };
};

type PlaylistItem = {
  id: string;
  snippet: {
    title: string;
    publishedAt: string;
    thumbnails: {
      medium: { url: string };
    };
    resourceId: {
      videoId: string;
    };
  };
};

type VideoStats = {
  id: string;
  statistics: {
    viewCount: string;
  };
};

export default function Home() {
  const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null);
  const [playlistItems, setPlaylistItems] = useState<PlaylistItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [totalVideos, setTotalVideos] = useState(0);
  const [videoViews, setVideoViews] = useState<Record<string, number>>({});
  const [totalCombinedViews, setTotalCombinedViews] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const PLAYLIST_ID = process.env.NEXT_PUBLIC_PLAYLIST_ID;
  const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

  console.log("this is PLAYLIST_ID:", PLAYLIST_ID);
  
  const timeAgo = (publishDate: string): string => {
    return formatDistanceToNow(new Date(publishDate), { addSuffix: false });
  };

  useEffect(() => {
    async function fetchPlaylistDetails() {
      try {
        // Fetch playlist metadata (title, description, thumbnails)
        const playlistRes = await fetch(
          `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${PLAYLIST_ID}&key=${API_KEY}`
        );
        if (!playlistRes.ok) throw new Error("Failed to fetch playlist details");
        const playlistData = await playlistRes.json();
        setPlaylistData(playlistData.items[0].snippet);

        // Fetch playlist items (videos)
        const itemsRes = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&maxResults=50&key=${API_KEY}`
        );
        if (!itemsRes.ok) throw new Error("Failed to fetch playlist items");
        const itemsData = await itemsRes.json();
        setPlaylistItems(itemsData.items);
        setTotalVideos(itemsData.pageInfo.totalResults);

        // Fetch video statistics (views)
        const videoIds = itemsData.items
          .map((item: PlaylistItem) => item.snippet.resourceId.videoId)
          .join(",");
        const videoStatsRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${API_KEY}`
        );
        if (!videoStatsRes.ok) throw new Error("Failed to fetch video statistics");
        const videoStatsData = await videoStatsRes.json();

        // Map video ID to view counts and calculate total combined views
        const viewsMap = videoStatsData.items.reduce(
          (map: Record<string, number>, video: VideoStats) => {
            map[video.id] = parseInt(video.statistics.viewCount, 10);
            return map;
          },
          {}
        );

        const totalViews = videoStatsData.items.reduce(
          (sum: number, video: VideoStats) => sum + parseInt(video.statistics.viewCount, 10),
          0
        );

        setVideoViews(viewsMap);
        setTotalCombinedViews(totalViews);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Fetch error:", err.message);  // Access `message` safely
          setError(err.message); // Set the error message
        } else {
          console.error("An unknown error occurred", err);
          setError("An unknown error occurred");
        }
      }
    }

    fetchPlaylistDetails();
  }, [PLAYLIST_ID, API_KEY]);

  if (error) return <div>Error: {error}</div>;
  if (!playlistData || !playlistItems) return <div>Loading...</div>;

  // Function to handle toggling of description
  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  return (
    <div className=" flex bg-gray-200">
      {/* Left div (fixed) */}
      <div className="w-[40%] ml-[2%] text-center mb-8 p-4 bg-gray-300 rounded-lg sticky top-0 h-screen">
        <div className="relative w-full max-w-md mx-auto aspect-video">
          <Image
            src={playlistData.thumbnails.high.url}
            alt={playlistData.title}
            fill
            className="rounded-md object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <h1 className="text-2xl font-bold mt-4 flex justify-start mb-2">
          {playlistData.title}
        </h1>
        <p className="text-gray-700 font-bold text-sm flex justify-start mb-2">
          {playlistData.channelTitle}
        </p>
        <p className="flex justify-start text-sm font-semibold mb-2">
          Playlist • {totalVideos} videos • {totalCombinedViews.toLocaleString()} views
        </p>

        {/* Display Playlist Description */}
        <p className="text-gray-600 text-left">
          {isDescriptionExpanded
            ? playlistData.description
            : playlistData.description.slice(0, 100) + "..."}
          <button onClick={toggleDescription} className="text-blue-500">
            {isDescriptionExpanded ? "Read Less" : " More"}
          </button>
        </p>
      </div>

      {/* Right div (scrollable) */}
      <div className="w-full ml-3 pt-4 h-screen overflow-y-auto">
        {playlistItems.map((item: PlaylistItem) => (
          <div key={item.id} className="border rounded-lg shadow-md mb-4 ">
            <div className="flex items-start">
              <Image
                src={item.snippet.thumbnails.medium.url}
                alt={item.snippet.title}
                width={160}
                height={100}
                className="rounded-md object-cover"
              />
              <div className="ml-4">
                <h3 className="font-semibold text-lg mb-2">{item.snippet.title}</h3>
                <p className="text-gray-700 text-sm font-semibold">
                  {playlistData.channelTitle} .{" "}
                  {videoViews[item.snippet.resourceId.videoId]?.toLocaleString() ||
                    "N/A"}{" "}
                  views . {timeAgo(item.snippet.publishedAt)} ago
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
