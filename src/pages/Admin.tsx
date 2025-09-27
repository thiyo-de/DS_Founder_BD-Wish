import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Search, Video, Image, Music, MessageSquare, Calendar, Trash2, LogIn, Eye, EyeOff } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Submission = {
  id: string;
  type: 'video' | 'photo' | 'post' | 'voice' | 'text';
  name: string;
  message: string | null;
  url: string | null;
  provider: string | null;
  status: 'pending' | 'approved' | 'rejected';
  org: string | null;
  city: string | null;
  created_at: string;
};

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState<Submission | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if user is already authenticated
  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const correctUsername = import.meta.env.VITE_ADMIN_USERNAME;
    const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    if (loginData.username === correctUsername && loginData.password === correctPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      toast({
        title: "Login Successful",
        description: "Welcome to the Admin Dashboard",
        className: "bg-[#0606bc] text-white"
      });
    } else {
      setLoginError("Invalid username or password");
      toast({
        title: "Login Failed",
        description: "Please check your credentials",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    setLoginData({ username: "", password: "" });
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out"
    });
  };

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['all-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Submission[];
    },
    enabled: isAuthenticated
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'approved' | 'rejected' }) => {
      const { error } = await supabase
        .from('submissions')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, { status }) => {
      queryClient.invalidateQueries({ queryKey: ['all-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['approved-submissions'] });
      toast({
        title: `Submission ${status}`,
        description: `The wish has been ${status}.`,
        className: status === 'approved' ? "bg-green-600 text-white" : "bg-[#FF6B6B] text-white"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update submission status",
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-submissions'] });
      queryClient.invalidateQueries({ queryKey: ['approved-submissions'] });
      setDeleteDialogOpen(false);
      setSubmissionToDelete(null);
      toast({
        title: "Submission deleted",
        description: "The wish has been permanently deleted.",
        className: "bg-[#0A0A2E] text-white"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete submission",
        variant: "destructive"
      });
    }
  });

  const handleStatusUpdate = (id: string, newStatus: "approved" | "rejected") => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const handleDeleteClick = (submission: Submission) => {
    setSubmissionToDelete(submission);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (submissionToDelete) {
      deleteMutation.mutate(submissionToDelete.id);
    }
  };

  const filteredSubmissions = submissions.filter(sub =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    const iconClass = "h-4 w-4";
    switch (type) {
      case "video": return <Video className={iconClass} />;
      case "photo": 
      case "post": return <Image className={iconClass} />;
      case "voice": return <Music className={iconClass} />;
      case "text": return <MessageSquare className={iconClass} />;
      default: return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video": return "bg-blue-100 text-blue-800";
      case "photo": return "bg-purple-100 text-purple-800";
      case "post": return "bg-pink-100 text-pink-800";
      case "voice": return "bg-orange-100 text-orange-800";
      case "text": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-600 text-white px-2 py-1">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive" className="bg-[#FF6B6B] text-white px-2 py-1">Rejected</Badge>;
      case "pending":
      default:
        return <Badge className="bg-[#faf200] text-[#0A0A2E] px-2 py-1">Pending</Badge>;
    }
  };

  const stats = {
    pending: submissions.filter(s => s.status === "pending").length,
    approved: submissions.filter(s => s.status === "approved").length,
    rejected: submissions.filter(s => s.status === "rejected").length,
    total: submissions.length
  };

  // Login Panel
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A2E] to-[#0606bc] flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="mx-auto w-16 h-16 bg-[#0606bc] rounded-full flex items-center justify-center">
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#0A0A2E]">
              Admin Login
            </CardTitle>
            <p className="text-[#666]">Enter your credentials to access the dashboard</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-[#333]">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  placeholder="Enter your username"
                  className="h-12 border-[#E8E8ED] focus:border-[#0606bc]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-[#333]">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    placeholder="Enter your password"
                    className="h-12 border-[#E8E8ED] focus:border-[#0606bc] pr-12"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {loginError && (
                <div className="text-[#FF6B6B] text-sm text-center bg-[#FF6B6B]/10 p-2 rounded">
                  {loginError}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-[#0606bc] hover:bg-[#0505a3] text-white font-semibold"
              >
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFDF8] p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 p-4 bg-white rounded-2xl shadow-sm border border-[#E8E8ED]">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-2xl lg:text-3xl font-bold text-[#0A0A2E] mb-2">
              Birthday Wishes Admin
            </h1>
            <p className="text-[#666]">
              Moderate birthday wishes and manage submissions
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-[#0606bc] text-[#0606bc] hover:bg-[#0606bc] hover:text-white"
          >
            Logout
          </Button>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#E8E8ED] p-1 rounded-xl">
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-[#0606bc] data-[state=active]:text-white rounded-lg"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="submissions"
              className="data-[state=active]:bg-[#0606bc] data-[state=active]:text-white rounded-lg"
            >
              All Submissions ({submissions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#0A0A2E]">Total Submissions</CardTitle>
                  <Calendar className="h-4 w-4 text-[#0606bc]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#0606bc]">{stats.total}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#0A0A2E]">Pending Review</CardTitle>
                  <Badge className="bg-[#faf200] text-[#0A0A2E]">{stats.pending}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#0A0A2E]">Approved</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#0A0A2E]">Rejected</CardTitle>
                  <XCircle className="h-4 w-4 text-[#FF6B6B]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#FF6B6B]">{stats.rejected}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Submissions */}
            <Card className="border-[#E8E8ED] shadow-sm">
              <CardHeader className="bg-gradient-to-r from-[#0606bc] to-[#0A0A2E] text-white rounded-t-lg">
                <CardTitle className="text-white">Recent Submissions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-[#E8E8ED]">
                  {submissions.slice(0, 5).map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-4 hover:bg-[#F5F5F5] transition-colors">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`p-2 rounded-full ${getTypeColor(submission.type)}`}>
                          {getTypeIcon(submission.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-[#0A0A2E] truncate">{submission.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className={`text-xs capitalize ${getTypeColor(submission.type)}`}>
                              {submission.type}
                            </Badge>
                            {submission.org && (
                              <span className="text-xs text-[#666] truncate">{submission.org}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                        {getStatusBadge(submission.status)}
                        <span className="text-sm text-[#666] whitespace-nowrap">
                          {new Date(submission.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submissions" className="space-y-6">
            {/* Search Bar */}
            <Card className="border-[#E8E8ED] shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="relative flex-1 max-w-xl w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#666]" />
                    <Input
                      placeholder="Search by name, type, or message..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-12 border-[#E8E8ED] focus:border-[#0606bc]"
                    />
                  </div>
                  <Badge variant="outline" className="h-8 bg-[#E8E8ED] text-[#0A0A2E]">
                    {filteredSubmissions.length} results
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Submissions List */}
            <div className="grid gap-4">
              {filteredSubmissions.map((submission) => (
                <Card key={submission.id} className="border-[#E8E8ED] shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4 lg:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className={`p-3 rounded-xl ${getTypeColor(submission.type)} flex-shrink-0`}>
                          {getTypeIcon(submission.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <h3 className="font-semibold text-lg text-[#0A0A2E] truncate">{submission.name}</h3>
                            {getStatusBadge(submission.status)}
                            <Badge variant="outline" className={`capitalize ${getTypeColor(submission.type)}`}>
                              {submission.type}
                            </Badge>
                          </div>
                          
                          {submission.message && (
                            <p className="text-[#666] mb-3 line-clamp-2 bg-[#F5F5F5] p-3 rounded-lg">
                              {submission.message}
                            </p>
                          )}
                          
                          {submission.url && (
                            <div className="mb-3">
                              <p className="text-xs text-[#666] font-mono bg-[#F5F5F5] p-2 rounded truncate">
                                📎 {submission.url}
                              </p>
                            </div>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-3 text-sm text-[#666]">
                            <span>📅 {new Date(submission.created_at).toLocaleDateString()}</span>
                            {submission.org && <span>• 🏢 {submission.org}</span>}
                            {submission.city && <span>• 🏙️ {submission.city}</span>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2 flex-shrink-0">
                        {submission.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleStatusUpdate(submission.id, "approved")}
                              disabled={updateStatusMutation.isPending}
                              className="bg-green-600 hover:bg-green-700 text-white gap-2"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(submission.id, "rejected")}
                              disabled={updateStatusMutation.isPending}
                              className="border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white gap-2"
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </Button>
                          </>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteClick(submission)}
                          disabled={deleteMutation.isPending}
                          className="border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white gap-2"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Loading State */}
            {isLoading && (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="w-4 h-4 bg-[#0606bc] rounded-full animate-pulse"></div>
                    <div className="w-4 h-4 bg-[#0606bc] rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-4 h-4 bg-[#0606bc] rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                  <p className="text-[#666]">Loading submissions...</p>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {!isLoading && filteredSubmissions.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-[#E8E8ED] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-[#666]" />
                  </div>
                  <p className="text-[#666] text-lg">No submissions found</p>
                  <p className="text-[#999]">Try adjusting your search terms</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="border-[#FF6B6B]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-[#0A0A2E]">Delete Submission</AlertDialogTitle>
              <AlertDialogDescription className="text-[#666]">
                Are you sure you want to permanently delete this wish from "{submissionToDelete?.name}"? 
                This action cannot be undone and will remove it from the Birthday Wishes Wall.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-[#E8E8ED] hover:bg-[#F5F5F5]">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Admin;