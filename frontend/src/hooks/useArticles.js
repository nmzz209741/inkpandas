import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createArticle,
  deleteArticle,
  getAllArticles,
  getArticleById,
  getMyArticles,
  updateArticle,
} from "../api/articlesApi";
import { useEffect, useState } from "react";

export const useGetArticles = (page, limit) => {
  const [allArticles, setAllArticles] = useState([]);
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["articles", page, limit],
    queryFn: () => getAllArticles(page, limit),
    keepPreviousData: true,
  });

  useEffect(() => {
    if (data?.articles) {
      setAllArticles((prev) => {
        const newArticles = data.articles.filter(
          (newArticle) =>
            !prev.some(
              (existingArticle) => existingArticle.id === newArticle.id
            )
        );
        return [...prev, ...newArticles];
      });
    }
  }, [data]);

  return {
    data: {
      ...data,
      articles: allArticles,
    },
    isLoading,
    error,
    isFetchingNextPage: isFetching && !!page,
  };
};

export const useGetMyArticles = (page, limit) => {
  const [allArticles, setAllArticles] = useState([]);
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["myArticles", page, limit],
    queryFn: () => getMyArticles(page, limit),
    keepPreviousData: true,
  });

  useEffect(() => {
    if (data?.articles) {
      setAllArticles((prev) => {
        const newArticles = data.articles.filter(
          (newArticle) =>
            !prev.some(
              (existingArticle) => existingArticle.id === newArticle.id
            )
        );
        return [...prev, ...newArticles];
      });
    }
  }, [data]);

  return {
    data: {
      ...data,
      articles: allArticles,
    },
    isLoading,
    error,
    isFetchingNextPage: isFetching && !!page,
  };
};

export const useGetArticle = (id) => {
  return useQuery({
    queryKey: ["article", id],
    queryFn: () => getArticleById(id),
    enabled: !!id,
  });
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (article) => createArticle(article),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["articles"] });
      await queryClient.invalidateQueries({ queryKey: ["myArticles"] });
    },
  });
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateArticle(id, data),
    onSuccess: async (data, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["articles"] });
      await queryClient.invalidateQueries({
        queryKey: ["myArticles"],
        refetchType: "all",
      });
      await queryClient.invalidateQueries({
        queryKey: ["article", variables.id],
      });
    },
  });
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["myArticles"] });
    },
  });
};
