import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Edit, Eye, Trash2 } from "lucide-react";

const styles = {
  noArticles: {
    textAlign: "center",
    padding: 4,
  },
  tableHeader: {
    fontSize: 1.5,
    fontWeight: "bold",
  },
  title: {
    width: 300,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  description: {
    width: 300,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  actions: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    gap: 1,
  },
};

const columns = [
  { name: "title", fieldName: "title" },
  { name: "description", fieldName: "description" },
  { name: "created", fieldName: "createdAt" },
  { name: "last updated", fieldName: "updatedAt" },
];

const MyArticlesTable = ({
  sortField,
  sortOrder,
  sortedArticles,
  navigate,
  handleSort,
  handleDelete,
}) => {
  return (
    <Paper sx={styles.tableContainer}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell variant="header" key={column.fieldName}>
                  <TableSortLabel
                    active={sortField === column.fieldName}
                    direction={
                      sortField === column.fieldName ? sortOrder : "asc"
                    }
                    onClick={() => handleSort(column.fieldName)}
                  >
                    {column.name}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell align="center" variant="header">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedArticles.map((article) => (
              <TableRow key={article.id}>
                <TableCell>
                  <Typography variant="body1" sx={styles.title}>
                    {article.title}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={styles.description}>
                    {article.content}
                  </Typography>
                </TableCell>
                <TableCell>
                  {new Date(article.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {article.updatedAt
                    ? new Date(article.updatedAt).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell align="center">
                  <Box sx={styles.actions}>
                    <Tooltip title="View">
                      <IconButton
                        onClick={() => navigate(`/articles/${article.id}`)}
                        color="primary"
                      >
                        <Eye size={20} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => navigate(`/articles/${article.id}/edit`)}
                        color="primary"
                      >
                        <Edit size={20} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleDelete(article.id)}
                        color="error"
                      >
                        <Trash2 size={20} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {sortedArticles.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} sx={styles.noArticles}>
                  <Typography variant="body2" color="text.secondary">
                    No articles found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default MyArticlesTable;
