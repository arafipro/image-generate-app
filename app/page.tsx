"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, { message: "プロンプトを入力してください。" }),
});

export default function ImageGenerateForm() {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const response = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: values.prompt }),
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } else {
        console.error("画像生成に失敗しました");
      }
    } catch (e) {
      console.error("エラーが発生しました", e);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-[1024px] mx-auto p-4 bg-slate-400">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="画像を生成するためのテキストを入力してください"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "生成中..." : "生成"}
          </Button>
        </form>
      </Form>
      <div className="mt-8">
        {imageUrl ? (
          <Image src={imageUrl} alt="生成画像" width={1024} height={1024} />
        ) : (
          <Skeleton className="w-full aspect-square" />
        )}
      </div>
    </div>
  );
}
