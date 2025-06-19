import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Play, CheckCircle, Database, ArrowRight, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MigrationConfig } from "@/lib/types";
import { AGREEMENT_OPTIONS, SELECTION_QUERY_OPTIONS } from "@/lib/mock-data";

const migrationSchema = z.object({
  sourceDbServer: z.string().min(1, "Source DB Server is required"),
  sourceDbName: z.string().min(1, "Source DB Name is required"),
  targetDbName: z.string().min(1, "Target DB Name is required"),
  etlDbName: z.string().min(1, "ETL DB Name is required"),
  agreement: z.string().min(1, "Agreement is required"),
  exportCriteria: z.string().min(1, "Selection Query is required"),
  selectionParameter: z.string().optional(),
  exportDirectory: z.string().optional(),
  logDirectory: z.string().optional(),
  agreementNotes: z.string().optional(),
});

interface ExecutionFormProps {
  onExecute: (config: MigrationConfig) => void;
  isExecuting: boolean;
  lastResult: { recordCount: number; executionTime: number; message: string } | null;
  onClearResult: () => void;
}

export function ExecutionForm({ onExecute, isExecuting, lastResult, onClearResult }: ExecutionFormProps) {
  const form = useForm<MigrationConfig>({
    resolver: zodResolver(migrationSchema),
    defaultValues: {
      sourceDbServer: "",
      sourceDbName: "",
      targetDbName: "",
      etlDbName: "",
      agreement: "",
      exportCriteria: "",
      selectionParameter: "",
      exportDirectory: "",
      logDirectory: "",
      agreementNotes: "",
    },
  });

  const onSubmit = (values: MigrationConfig) => {
    onClearResult();
    onExecute(values);
  };

  return (
    <Card className="mb-8">
      <CardHeader className="border-b border-border">
        <CardTitle className="flex items-center">
          <Play className="text-primary mr-2" />
          Data Migration Execution
        </CardTitle>
        <CardDescription>Configure and execute data migration between databases</CardDescription>
      </CardHeader>

      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* SSIS ETL Architecture Explanation */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center mb-2">
                <Database className="text-blue-600 mr-2" />
                <strong className="text-blue-800">SSIS Package Execution Architecture</strong>
              </div>
              <div className="text-sm text-blue-800">
                This configuration connects to the ETL database and executes a SQL script that triggers the appropriate SSIS package. 
                The source and target database parameters are passed to the SSIS package for processing.
              </div>
            </div>

            {/* ETL Database Configuration */}
            <div className="border-t border-border pt-6 mb-6">
              <h3 className="text-md font-medium text-foreground mb-4 flex items-center">
                <Database className="text-muted-foreground mr-2" />
                ETL Control Database
              </h3>
              
              <FormField
                control={form.control}
                name="etlDbName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ETL Database Connection <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., PLEXIS_ETL_CONTROL" {...field} />
                    </FormControl>
                    <FormDescription>
                      Database containing SSIS package execution scripts and control tables
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* SSIS Package Parameters */}
            <div className="border-t border-border pt-6">
              <h3 className="text-md font-medium text-foreground mb-4 flex items-center">
                <ArrowRight className="text-muted-foreground mr-2" />
                SSIS Package Parameters
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">Source Database Parameters</h4>
                  
                  <FormField
                    control={form.control}
                    name="sourceDbServer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source DB Server <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., SQL-PROD-01" {...field} />
                        </FormControl>
                        <FormDescription>
                          Server hosting the source data for SSIS package
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="sourceDbName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source DB Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., PLEXIS_PROD" {...field} />
                        </FormControl>
                        <FormDescription>
                          Database containing source data
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-muted-foreground">Target Database Parameters</h4>
                  
                  <FormField
                    control={form.control}
                    name="targetDbName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target DB Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CLIENT_STAGING" {...field} />
                        </FormControl>
                        <FormDescription>
                          Destination database for processed data
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Migration Settings Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="agreement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agreement Type <span className="text-destructive">*</span></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Agreement..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {AGREEMENT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="exportCriteria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selection Query <span className="text-destructive">*</span></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Query Type..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SELECTION_QUERY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Selection Query Explanation */}
            {form.watch('exportCriteria') && (
              <div className="border-t border-border pt-6">
                <h3 className="text-md font-medium text-foreground mb-3 flex items-center">
                  <Settings2 className="text-muted-foreground mr-2" />
                  Selection Query Details
                </h3>
                
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm text-blue-800">
                    {form.watch('exportCriteria') === 'all-records' && (
                      <div>
                        <strong>All Records:</strong> This will migrate all available data from the source database without any filtering. 
                        <span className="text-blue-600 italic block mt-1">No additional parameters required.</span>
                      </div>
                    )}
                    {form.watch('exportCriteria') === 'by-contract' && (
                      <div>
                        <strong>Select by Contract ID:</strong> Filter data to include only records associated with specific contract identifiers. 
                        Useful for migrating data for particular client agreements or contract renewals.
                        <span className="text-blue-600 italic block mt-1">Enter one or more contract IDs separated by commas.</span>
                      </div>
                    )}
                    {form.watch('exportCriteria') === 'by-date' && (
                      <div>
                        <strong>Select by Date Range:</strong> Filter data based on creation, modification, or effective dates. 
                        Commonly used for periodic migrations or historical data backups.
                        <span className="text-blue-600 italic block mt-1">Specify date range in YYYY-MM-DD format or use "to" for ranges.</span>
                      </div>
                    )}
                    {form.watch('exportCriteria') === 'by-provider' && (
                      <div>
                        <strong>Select by Provider ID:</strong> Filter data to include only records for specific healthcare providers or network participants. 
                        Ideal for provider-specific migrations or network updates.
                        <span className="text-blue-600 italic block mt-1">Enter one or more provider IDs separated by commas.</span>
                      </div>
                    )}
                    {form.watch('exportCriteria') === 'incremental' && (
                      <div>
                        <strong>Incremental Changes Only:</strong> Migrate only records that have been modified since the last migration run. 
                        Efficient for regular synchronization between systems.
                        <span className="text-blue-600 italic block mt-1">Optionally specify a cutoff date or leave blank to use system defaults.</span>
                      </div>
                    )}
                    {form.watch('exportCriteria') === 'custom-query' && (
                      <div>
                        <strong>Custom SQL Query:</strong> Define precise selection criteria using SQL WHERE conditions. 
                        Provides maximum flexibility for complex filtering requirements.
                        <span className="text-blue-600 italic block mt-1">Enter SQL conditions or complete WHERE clause (without "WHERE" keyword).</span>
                      </div>
                    )}
                  </div>
                </div>

                {form.watch('exportCriteria') !== 'all-records' && (
                  <FormField
                    control={form.control}
                    name="selectionParameter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {form.watch('exportCriteria') === 'by-contract' && 'Contract ID(s)'}
                          {form.watch('exportCriteria') === 'by-date' && 'Date Range'}
                          {form.watch('exportCriteria') === 'by-provider' && 'Provider ID(s)'}
                          {form.watch('exportCriteria') === 'incremental' && 'Cutoff Date (Optional)'}
                          {form.watch('exportCriteria') === 'custom-query' && 'SQL Conditions'}
                        </FormLabel>
                        <FormControl>
                          {form.watch('exportCriteria') === 'custom-query' ? (
                            <Textarea
                              rows={4}
                              className="resize-none font-mono text-sm"
                              placeholder="status = 'ACTIVE' AND last_modified > '2024-01-01'"
                              {...field}
                            />
                          ) : (
                            <Input 
                              placeholder={
                                form.watch('exportCriteria') === 'by-contract' ? 'CONTRACT001, CONTRACT002, CONTRACT003' :
                                form.watch('exportCriteria') === 'by-date' ? '2024-01-01 to 2024-12-31' :
                                form.watch('exportCriteria') === 'by-provider' ? 'PROV001, PROV002, PROV003' :
                                form.watch('exportCriteria') === 'incremental' ? '2024-01-01 (or leave blank)' :
                                'Enter parameter value...'
                              }
                              {...field} 
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            {/* Optional Configuration Section */}
            <div className="border-t border-border pt-6">
              <h3 className="text-md font-medium text-foreground mb-4 flex items-center">
                <Settings2 className="text-muted-foreground mr-2" />
                Optional Configuration
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <FormField
                  control={form.control}
                  name="exportDirectory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Export Directory Path</FormLabel>
                      <FormControl>
                        <Input placeholder="C:\Exports\Migration\" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="logDirectory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Log Directory Path</FormLabel>
                      <FormControl>
                        <Input placeholder="C:\Logs\Migration\" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="agreementNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agreement Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={3}
                        className="resize-none"
                        placeholder="Additional notes or special instructions for this migration..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Execution Button */}
            <div className="flex justify-end pt-6 border-t border-border">
              <Button 
                type="submit" 
                disabled={isExecuting}
                className="px-6 py-2 font-medium"
              >
                {isExecuting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Executing...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Execute Migration
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>

        {/* Success Message */}
        {lastResult && (
          <Alert className="mt-6 border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              <strong className="font-medium">Migration Completed Successfully</strong>
              <p className="mt-1">{lastResult.message}</p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
