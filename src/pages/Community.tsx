import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Heart, 
  Share2,
  Eye,
  ThumbsUp,
  Calendar,
  MapPin
} from 'lucide-react';

const Community = () => {
  const trendingTopics = [
    { name: 'Sustainable Fashion', posts: 245, trend: '+12%' },
    { name: 'Indian Ethnic Wear', posts: 189, trend: '+8%' },
    { name: 'Wedding Collections', posts: 156, trend: '+15%' },
    { name: 'Street Style', posts: 134, trend: '+5%' },
  ];

  const communityPosts = [
    {
      id: 1,
      author: 'Priya Sharma',
      role: 'Designer',
      title: 'Latest trends in sustainable fabric choices',
      preview: 'Exploring eco-friendly materials that are changing the fashion industry...',
      likes: 67,
      comments: 23,
      views: 1200,
      timeAgo: '2 hours ago',
      tags: ['Sustainable', 'Fabric', 'Trends']
    },
    {
      id: 2,
      author: 'Arjun Menon',
      role: 'Fashion Enthusiast',
      title: 'My experience with custom bridal wear',
      preview: 'Sharing my journey of designing the perfect wedding outfit...',
      likes: 89,
      comments: 34,
      views: 2100,
      timeAgo: '5 hours ago',
      tags: ['Bridal', 'Custom', 'Experience']
    },
    {
      id: 3,
      author: 'Kavya Patel',
      role: 'Designer',
      title: 'Color psychology in fashion design',
      preview: 'Understanding how colors affect mood and perception in clothing...',
      likes: 45,
      comments: 18,
      views: 890,
      timeAgo: '1 day ago',
      tags: ['Psychology', 'Color', 'Design']
    }
  ];

  const upcomingEvents = [
    {
      title: 'Virtual Fashion Week',
      date: 'March 15-20, 2024',
      location: 'Online',
      attendees: 2500
    },
    {
      title: 'Sustainable Fashion Workshop',
      date: 'March 25, 2024',
      location: 'Mumbai',
      attendees: 150
    },
    {
      title: 'Designer Meetup Delhi',
      date: 'April 2, 2024',
      location: 'New Delhi',
      attendees: 75
    }
  ];

  return (
    <div className="min-h-screen bg-canvas pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-ink mb-4">
            Fashion Community
          </h1>
          <p className="text-lg text-muted-ink max-w-2xl mx-auto">
            Connect, share, and learn with fellow fashion enthusiasts and professionals
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="posts">Latest Posts</TabsTrigger>
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="mt-6">
                <div className="space-y-6">
                  {communityPosts.map((post) => (
                    <Card key={post.id} className="bg-card border-muted-ink/20 hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-antique-gold/20 to-muted-ink/20 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-muted-ink" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-ink">{post.author}</h4>
                              <Badge variant="secondary" className="text-xs">
                                {post.role}
                              </Badge>
                              <span className="text-xs text-muted-ink">•</span>
                              <span className="text-xs text-muted-ink">{post.timeAgo}</span>
                            </div>
                            
                            <h3 className="text-lg font-semibold text-ink mb-2 hover:text-antique-gold cursor-pointer">
                              {post.title}
                            </h3>
                            
                            <p className="text-muted-ink text-sm mb-3">
                              {post.preview}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex items-center gap-6 text-sm text-muted-ink">
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="h-4 w-4" />
                                <span>{post.likes}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>{post.comments}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                <span>{post.views}</span>
                              </div>
                              <div className="flex items-center gap-2 ml-auto">
                                <Button variant="ghost" size="sm">
                                  <Heart className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="trending" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {trendingTopics.map((topic, index) => (
                    <Card key={index} className="bg-card border-muted-ink/20">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-ink">{topic.name}</h3>
                          <Badge className="bg-green-100 text-green-800">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {topic.trend}
                          </Badge>
                        </div>
                        <p className="text-muted-ink text-sm mb-2">
                          {topic.posts} posts this week
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                          Explore Topic
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="events" className="mt-6">
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <Card key={index} className="bg-card border-muted-ink/20">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-ink mb-2">
                              {event.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-muted-ink mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>{event.date}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{event.attendees} attending</span>
                              </div>
                            </div>
                          </div>
                          <Button className="bg-antique-gold hover:bg-antique-gold/90 text-ink">
                            Join Event
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Community Stats */}
              <Card className="bg-card border-muted-ink/20">
                <CardHeader>
                  <CardTitle className="text-lg">Community Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-ink">Total Members</span>
                      <span className="font-semibold text-ink">12,450</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-ink">Active Today</span>
                      <span className="font-semibold text-ink">1,234</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-ink">Posts This Week</span>
                      <span className="font-semibold text-ink">567</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-ink">Events This Month</span>
                      <span className="font-semibold text-ink">8</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Tags */}
              <Card className="bg-card border-muted-ink/20">
                <CardHeader>
                  <CardTitle className="text-lg">Popular Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {['Sustainable', 'Bridal', 'Ethnic', 'Western', 'Street Style', 'Vintage', 'Minimalist', 'Boho'].map((tag) => (
                      <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-antique-gold/10">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Create Post */}
              <Card className="bg-card border-muted-ink/20">
                <CardHeader>
                  <CardTitle className="text-lg">Share Your Story</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-ink text-sm mb-4">
                    Have a fashion story to share? Connect with the community!
                  </p>
                  <Button className="w-full bg-antique-gold hover:bg-antique-gold/90 text-ink">
                    Create Post
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;