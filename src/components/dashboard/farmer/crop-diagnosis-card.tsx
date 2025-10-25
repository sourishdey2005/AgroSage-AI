'use client';

import * as React from 'react';
import Image from 'next/image';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload, X, Leaf, Sparkles, Wand2 } from 'lucide-react';
import { diagnoseCropDisease } from '@/ai/flows/crop-disease-diagnosis';
import type { DiagnoseCropDiseaseOutput } from '@/ai/flows/crop-disease-diagnosis';
import { placeholderImages } from '@/lib/placeholder-images.json';

const diseaseLeafImage = placeholderImages.find(p => p.id === 'disease-leaf');

const schema = z.object({
  cropImage: z.any().refine(fileList => fileList.length > 0, 'A crop image is required.'),
});

type FormSchema = z.infer<typeof schema>;

export function CropDiagnosisCard() {
  const [preview, setPreview] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<DiagnoseCropDiseaseOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const { register, handleSubmit, watch, resetField } = useForm<FormSchema>({
    resolver: zodResolver(schema),
  });

  const fileWatch = watch('cropImage');

  React.useEffect(() => {
    if (fileWatch && fileWatch.length > 0) {
      const file = fileWatch[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }, [fileWatch]);

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const file = data.cropImage[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64Image = reader.result as string;
        const diagnosisResult = await diagnoseCropDisease({ photoDataUri: base64Image });
        setResult(diagnosisResult);
      } catch (err) {
        setError('Failed to diagnose crop disease. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError('Failed to read the image file.');
      setIsLoading(false);
    };
  };

  const handleClear = () => {
    resetField('cropImage');
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'low': return 'bg-yellow-400';
      case 'medium': return 'bg-orange-500';
      case 'high': return 'bg-red-600';
      default: return 'bg-green-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"><Leaf /> AI Crop Diagnosis</CardTitle>
        <CardDescription>Upload an image of a crop leaf to get an instant health diagnosis from our AI.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="cropImage" className="mb-2 block font-semibold">Crop Image</Label>
              <div className="relative">
                <Input id="cropImage" type="file" accept="image/*" {...register('cropImage')} className="hidden" />
                <Label htmlFor="cropImage" className="border-2 border-dashed border-muted-foreground/50 rounded-lg p-8 w-full flex flex-col items-center justify-center cursor-pointer hover:bg-muted transition-colors">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span className="mt-2 text-sm text-muted-foreground">{preview ? 'Change image' : 'Click to upload image'}</span>
                </Label>
              </div>
            </div>
            {preview && (
              <div className="relative w-full h-48 rounded-md overflow-hidden ring-1 ring-border">
                <Image src={preview} alt="Crop preview" fill style={{ objectFit: 'cover' }} />
                <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={handleClear}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <Button type="submit" className="w-full font-bold" disabled={isLoading || !preview}>
              {isLoading ? 'Diagnosing...' : 'Diagnose Crop'} <Wand2 className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg font-headline">Diagnosis Result</h3>
            {isLoading && (
                <div className="space-y-4">
                    <div className="h-8 w-3/4 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-full bg-muted rounded animate-pulse" />
                    <div className="h-4 w-full bg-muted rounded animate-pulse" />
                </div>
            )}
            {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
            {!isLoading && !result && !error && (
                <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full">
                    {diseaseLeafImage && <Image src={diseaseLeafImage.imageUrl} alt={diseaseLeafImage.description} data-ai-hint={diseaseLeafImage.imageHint} width={100} height={100} className="opacity-50 mb-4" />}
                    <p className="text-muted-foreground">Upload an image and click "Diagnose Crop" to see the AI analysis here.</p>
                </div>
            )}
            {result && (
              <Card className="bg-muted/30">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label>Disease</Label>
                    <p className="text-xl font-bold font-headline text-primary">{result.diseaseName || 'Healthy'}</p>
                  </div>
                  {result.diseaseName && (
                    <>
                      <div>
                        <Label>Severity</Label>
                        <div className="flex items-center gap-2">
                           <Progress value={result.confidence * 100} className={getSeverityColor(result.severity)} />
                           <span className="font-semibold text-sm capitalize">{result.severity}</span>
                        </div>
                      </div>
                      <div>
                        <Label>Confidence</Label>
                        <p className="font-mono text-lg font-semibold">{ (result.confidence * 100).toFixed(1) }%</p>
                      </div>
                      <Alert>
                        <Sparkles className="h-4 w-4 text-primary" />
                        <AlertTitle className="font-headline">AI Treatment Suggestion</AlertTitle>
                        <AlertDescription>{result.treatmentSuggestion}</AlertDescription>
                      </Alert>
                    </>
                  )}
                  {!result.diseaseName && (
                    <Alert>
                      <Sparkles className="h-4 w-4 text-primary" />
                      <AlertTitle className="font-headline">All Clear!</AlertTitle>
                      <AlertDescription>{result.treatmentSuggestion}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}