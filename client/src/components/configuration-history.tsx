import { useState } from "react";
import { History, Filter, Edit, Eye, Copy, Trash2, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HistoryRecord } from "@/lib/types";
import { AGREEMENT_OPTIONS } from "@/lib/mock-data";

interface ConfigurationHistoryProps {
  historyData: HistoryRecord[];
  onFilterChange: (filter: string) => void;
  onUpdateDescription: (recordId: number, description: string) => void;
}

export function ConfigurationHistory({ 
  historyData, 
  onFilterChange, 
  onUpdateDescription 
}: ConfigurationHistoryProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingDescription, setEditingDescription] = useState("");

  const handleEditDescription = (record: HistoryRecord) => {
    setEditingId(record.id);
    setEditingDescription(record.description);
  };

  const handleSaveDescription = (recordId: number) => {
    onUpdateDescription(recordId, editingDescription);
    setEditingId(null);
    setEditingDescription("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingDescription("");
  };

  const getStatusBadge = (status: string, recordCount: number) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              Completed ({recordCount?.toLocaleString() || 0})
            </div>
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2" />
              Failed
            </div>
          </Badge>
        );
      case 'running':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse" />
              Running
            </div>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            Unknown
          </Badge>
        );
    }
  };

  const getAgreementBadge = (agreement: string, label: string) => {
    const colorMap: { [key: string]: string } = {
      'benefit-contract-export': 'bg-blue-100 text-blue-800',
      'provider-import': 'bg-green-100 text-green-800',
      'member-enrollment': 'bg-purple-100 text-purple-800',
      'claims-processing': 'bg-orange-100 text-orange-800',
      'fee-schedule-sync': 'bg-yellow-100 text-yellow-800',
    };

    return (
      <Badge className={`${colorMap[agreement] || 'bg-gray-100 text-gray-800'}`}>
        {label}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader className="border-b border-border">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <History className="text-primary mr-2" />
              Configuration Set History
            </CardTitle>
            <CardDescription>View and manage previous migration configurations</CardDescription>
          </div>
          
          <div className="flex items-center space-x-4">
            <div>
              <Select onValueChange={onFilterChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Agreements" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agreements</SelectItem>
                  {AGREEMENT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {historyData.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No configurations found</h3>
            <p className="text-muted-foreground">No migration configurations match the selected criteria.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>File Name</TableHead>
                <TableHead>Agreement</TableHead>
                <TableHead>Selection Query</TableHead>
                <TableHead>Export Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyData.map((record) => (
                <TableRow key={record.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center">
                      <FileText className="text-muted-foreground mr-2 h-4 w-4" />
                      <span className="font-medium">{record.fileName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getAgreementBadge(record.agreement, record.agreementLabel)}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{record.criteriaLabel}</div>
                      {record.selectionParameter && (
                        <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded font-mono">
                          {record.selectionParameter}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(record.exportDate || record.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {getStatusBadge(record.status, record.recordCount)}
                  </TableCell>
                  <TableCell>
                    {editingId === record.id ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          value={editingDescription}
                          onChange={(e) => setEditingDescription(e.target.value)}
                          className="h-8"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveDescription(record.id);
                            } else if (e.key === 'Escape') {
                              handleCancelEdit();
                            }
                          }}
                          autoFocus
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSaveDescription(record.id)}
                          className="h-8 w-8 p-0"
                        >
                          <div className="w-3 h-3 border-2 border-green-600 rounded-full flex items-center justify-center">
                            <div className="w-1 h-1 bg-green-600 rounded-full" />
                          </div>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCancelEdit}
                          className="h-8 w-8 p-0"
                        >
                          <div className="w-3 h-3 border-2 border-gray-600 rounded-full relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-2 h-0.5 bg-gray-600 rotate-45" />
                              <div className="w-2 h-0.5 bg-gray-600 -rotate-45 absolute" />
                            </div>
                          </div>
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm">
                        {record.description || <em className="text-muted-foreground">No description</em>}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      {editingId !== record.id && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditDescription(record)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          // TODO: Implement view configuration details
                          alert(`Configuration Details:\n\nFile: ${record.fileName}\nAgreement: ${record.agreementLabel}\nCriteria: ${record.criteriaLabel}\nDate: ${record.exportDate}\nRecords: ${record.recordCount?.toLocaleString() || 'N/A'}\n\nDescription: ${record.description}`);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          // TODO: Implement copy configuration to form
                          alert(`Configuration copied to form!\n\nYou can now modify the settings and execute a new migration based on: ${record.fileName}`);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          // TODO: Implement delete configuration
                          if (confirm('Are you sure you want to delete this configuration? This action cannot be undone.')) {
                            alert('Delete functionality will be implemented when connected to backend API.');
                          }
                        }}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
