import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function CardSkeleton() {
  return (
    <Card className="rounded-2xl shadow-md animate-pulse">
      <CardHeader className="px-4 py-3">
        <div className="h-5 bg-muted rounded w-32" />
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-8 bg-muted rounded w-1/2 mt-4" />
        </div>
      </CardContent>
    </Card>
  );
}

export function CardError({ message }: { message?: string }) {
  return (
    <Card className="rounded-2xl shadow-md border-destructive/50">
      <CardContent className="px-4 py-6">
        <p className="text-base text-destructive text-center">
          {message || "Failed to load card"}
        </p>
      </CardContent>
    </Card>
  );
}
