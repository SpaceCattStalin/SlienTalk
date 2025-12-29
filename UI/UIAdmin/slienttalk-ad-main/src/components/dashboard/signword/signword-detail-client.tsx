'use client';

import '@google/model-viewer';
import * as React from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Card,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

// =========================
// TYPES
// =========================

export const WORD_TYPES = ["Chữ cái", "Cụm từ nghi vấn", "Danh từ", "Động từ"] as const;
export const CATEGORIES = ["Câu hỏi", "Chữ cái", "Gia đình", "Trường học"] as const;

export interface SignWordItem {
  signWordId: string;
  word: string;
  definition: string;
  wordType: typeof WORD_TYPES[number];
  exampleSentence: string;
  category: typeof CATEGORIES[number];
  signWordUri: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  item: SignWordItem;
}

// =========================
// COMPONENT
// =========================

export default function SignwordDetailClient({ item }: Props) {
  const [editMode, setEditMode] = React.useState(false);

  // FORM as PARTIAL (fix SetStateAction errors)
  const [form, setForm] = React.useState<Partial<SignWordItem>>({ ...item });

  const [showSuccess, setShowSuccess] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_ROOT;

  // detect file type
  const [fileType, setFileType] = React.useState<'video' | 'glb' | null>(null);

  React.useEffect(() => {
    setForm({ ...item });
  }, [item]);

  React.useEffect(() => {
    const uri = form.signWordUri || item.signWordUri || "";
    if (uri.match(/\.(mp4|webm|ogg)$/i)) setFileType("video");
    else if (uri.match(/\.glb$/i)) setFileType("glb");
    else setFileType(null);
  }, [form.signWordUri, item.signWordUri]);

  // =========================
  // HANDLERS
  // =========================

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setForm(prev => ({ ...prev, signWordUri: url }));
    }
  };

  const handleChange = (field: keyof SignWordItem, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const current = { ...item, ...form };

    if (!current.word?.trim()) newErrors.word = "Bắt buộc nhập ký hiệu";
    if (!current.definition?.trim()) newErrors.definition = "Bắt buộc nhập định nghĩa";
    if (!current.wordType) newErrors.wordType = "Bắt buộc chọn loại từ";
    if (!current.category) newErrors.category = "Bắt buộc chọn chủ đề";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const current = { ...item, ...form };

    const payload = {
      word: current.word,
      definition: current.definition,
      wordType: current.wordType,
      category: current.category,
      exampleSentence: current.exampleSentence,
      isActive: current.isActive,
    };

    const isChanged = Object.keys(payload).some(
      (key) => (payload as any)[key] !== (item as any)[key]
    );

    try {
      if (isChanged) {
        const res = await fetch(`${baseUrl}/api/admin/signwords/${item.signWordId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) return alert("Lỗi khi cập nhật ký hiệu!");
      }

      if (selectedFile) {
        const videoForm = new FormData();
        videoForm.append("file", selectedFile);

        const videoRes = await fetch(`${baseUrl}/api/admin/upload-video/${item.signWordId}`, {
          method: "POST",
          body: videoForm,
        });

        if (!videoRes.ok) return alert("Lỗi khi upload video!");
      }

      setEditMode(false);
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra!");
    }
  };

  const handleCancel = () => {
    setForm({ ...item });
    setEditMode(false);
    setErrors({});
  };

  const uriToShow = form.signWordUri || item.signWordUri;

  // =========================
  // RENDER
  // =========================

  return (
    <Stack spacing={3} sx={{ mt: 3, width: "100%", alignItems: "flex-start" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: "100%" }}>
        <Typography variant="h4" fontWeight={700}>Chi tiết ký hiệu</Typography>

        <Stack direction="row" spacing={2}>
          {!editMode ? (
            <Button variant="contained" onClick={() => setEditMode(true)}>Sửa</Button>
          ) : (
            <>
              <Button variant="contained" color="success" onClick={handleSave}>Lưu lại</Button>
              <Button variant="outlined" color="error" onClick={handleCancel}>Hủy</Button>
            </>
          )}
          <Link href="/dashboard/signwords">
            <Button variant="outlined">Quay lại</Button>
          </Link>
        </Stack>
      </Stack>

      <Card sx={{ p: 4, borderRadius: 3, boxShadow: 2, width: "100%" }}>
        <Typography variant="h6" fontWeight={600} mb={3}>Thông tin ký hiệu</Typography>

        <Stack direction={{ xs: "column", md: "row" }} spacing={5}>
          <Box flex={1}>
            <Stack spacing={2.5}>
              {/* WORD */}
              <TextField
                label="Ký hiệu"
                disabled={!editMode}
                value={form.word ?? item.word}
                onChange={(e) => handleChange("word", e.target.value)}
                error={!!errors.word}
                helperText={errors.word}
                fullWidth
              />

              {/* DEFINITION */}
              <TextField
                label="Định nghĩa"
                disabled={!editMode}
                multiline rows={2}
                value={form.definition ?? item.definition}
                onChange={(e) => handleChange("definition", e.target.value)}
                error={!!errors.definition}
                helperText={errors.definition}
                fullWidth
              />

              {/* TYPE */}
              <FormControl fullWidth error={!!errors.wordType}>
                <InputLabel>Loại từ</InputLabel>
                <Select
                  value={form.wordType ?? item.wordType}
                  label="Loại từ"
                  disabled={!editMode}
                  onChange={(e) => handleChange("wordType", e.target.value as any)}
                >
                  {WORD_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
                {errors.wordType && <Typography color="error" variant="caption">{errors.wordType}</Typography>}
              </FormControl>

              {/* CATEGORY */}
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel>Chủ đề</InputLabel>
                <Select
                  value={form.category ?? item.category}
                  label="Chủ đề"
                  disabled={!editMode}
                  onChange={(e) => handleChange("category", e.target.value as any)}
                >
                  {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </Select>
                {errors.category && <Typography color="error" variant="caption">{errors.category}</Typography>}
              </FormControl>

              {/* EXAMPLE SENTENCE */}
              <TextField
                label="Câu ví dụ"
                disabled={!editMode}
                multiline rows={2}
                value={form.exampleSentence ?? item.exampleSentence}
                onChange={(e) => handleChange("exampleSentence", e.target.value)}
                fullWidth
              />

              {/* ACTIVE */}
              <FormControlLabel
                control={
                  <Switch
                    disabled={!editMode}
                    checked={form.isActive ?? item.isActive}
                    onChange={(e) => handleChange("isActive", e.target.checked)}
                  />
                }
                label="Trạng thái hoạt động"
              />
            </Stack>
          </Box>

          {/* RIGHT COLUMN — VIDEO / MODEL */}
          <Box flex={1}>
            <Stack spacing={3}>
              {editMode && (
                <Button variant="outlined" component="label">
                  Chọn file
                  <input
                    type="file"
                    hidden
                    accept="video/*,.glb"
                    onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                  />
                </Button>
              )}

              {/* VIDEO */}
              {fileType === "video" && (
                <Box sx={{ p: 1, bgcolor: "#fafafa", borderRadius: 2 }}>
                  <Typography fontWeight={600}>Video ký hiệu</Typography>
                  <video
                    src={uriToShow.startsWith("http") ? uriToShow : baseUrl + uriToShow}
                    controls
                    width="100%"
                    style={{ borderRadius: 12 }}
                  />
                </Box>
              )}

              {/* 3D MODEL */}
              {fileType === "glb" && (
                <Box sx={{ p: 1, bgcolor: "#fafafa", borderRadius: 2 }}>
                  <Typography fontWeight={600}>Mô hình 3D</Typography>
                  <model-viewer
                    src={uriToShow.startsWith("http") ? uriToShow : baseUrl + uriToShow}
                    camera-target="0m 1m 0m"
                    min-camera-orbit="auto auto 1.5m"
                    max-camera-orbit="auto auto 5m"
                    autoplay
                    style={{ width: "100%", height: 300 }}
                  />
                </Box>
              )}

              <Divider />
            </Stack>
          </Box>
        </Stack>
      </Card>

      <Snackbar
        open={showSuccess}
        autoHideDuration={2500}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success">Lưu thành công!</Alert>
      </Snackbar>
    </Stack>
  );
}
