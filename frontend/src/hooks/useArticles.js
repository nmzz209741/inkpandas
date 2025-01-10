import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAllArticles, getArticleById } from "../api/articlesApi";

export const useArticles = (page, limit) => {
  return useQuery({
    queryKey: ["articles", page, limit],
    queryFn: () => getAllArticles(page, limit),
  });
};

export const useArticle = (id) => {
  return useQuery({
    queryKey: ["article", id],
    queryFn: () => getArticleById(id),
    enabled: !!id,
  });
};
