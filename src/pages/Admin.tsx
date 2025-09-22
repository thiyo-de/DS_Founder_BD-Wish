import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Search, Video, Image, Music, MessageSquare, Calendar, Trash2 } from "lucide-react";
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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ['all-submissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Submission[];
    }
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
        description: `The wish has been ${status}.`
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
        description: "The wish has been permanently deleted."
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
    sub.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />;
      case "photo": 
      case "post": return <Image className="h-4 w-4" />;
      case "voice": return <Music className="h-4 w-4" />;
      case "text": return <MessageSquare className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "pending":
      default:
        return <Badge variant="outline" className="text-amber-600 border-amber-600">Pending</Badge>;
    }
  };

  const stats = {
    pending: submissions.filter(s => s.status === "pending").length,
    approved: submissions.filter(s => s.status === "approved").length,
    rejected: submissions.filter(s => s.status === "rejected").length,
    total: submissions.length
  };

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-outfit font-bold text-primary mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Moderate birthday wishes and manage submissions
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="submissions">All Submissions</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                  <Badge variant="outline" className="text-amber-600 border-amber-600">
                    {stats.pending}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approved</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                  <XCircle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{stats.rejected}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissions.slice(0, 5).map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(submission.type)}
                        <div>
                          <p className="font-medium">{submission.name}</p>
                          <p className="text-sm text-muted-foreground capitalize">{submission.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(submission.status)}
                        <span className="text-sm text-muted-foreground">
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
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid gap-4">
              {filteredSubmissions.map((submission) => (
                <Card key={submission.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {getTypeIcon(submission.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{submission.name}</h3>
                            {getStatusBadge(submission.status)}
                            <span className="text-sm text-muted-foreground capitalize">
                              {submission.type}
                            </span>
                          </div>
                          
                          {submission.message && (
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {submission.message}
                            </p>
                          )}
                          
                          {submission.url && (
                            <p className="text-xs text-muted-foreground mb-2 font-mono truncate">
                              {submission.url}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{new Date(submission.created_at).toLocaleDateString()}</span>
                            {submission.org && <span>• {submission.org}</span>}
                            {submission.city && <span>• {submission.city}</span>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        {submission.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(submission.id, "approved")}
                              disabled={updateStatusMutation.isPending}
                              className="text-green-600 border-green-600 hover:bg-green-50"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusUpdate(submission.id, "rejected")}
                              disabled={updateStatusMutation.isPending}
                              className="text-destructive border-destructive hover:bg-destructive/10"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteClick(submission)}
                          disabled={deleteMutation.isPending}
                          className="text-destructive border-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {isLoading && (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <div className="w-4 h-4 bg-primary rounded-full animate-pulse"></div>
                    <div className="w-4 h-4 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-4 h-4 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                  <p className="text-muted-foreground">Loading submissions...</p>
                </CardContent>
              </Card>
            )}

            {!isLoading && filteredSubmissions.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">No submissions found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Submission</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to permanently delete this wish from "{submissionToDelete?.name}"? 
                This action cannot be undone and will remove it from the Birthday Wishes Wall.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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