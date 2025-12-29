'use client';

import * as React from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Stack,
    Switch,
    Snackbar,
    Alert,
    FormControlLabel,
    Card,
} from '@mui/material';
import { WORD_TYPES, CATEGORIES } from './signwords-table';
import api from '@/utils/axiosConfig';

interface Props {
    open: boolean;
    onClose: () => void;
    onCreated: () => void;
}

export default function AddSignwordModal({ open, onClose, onCreated }: Props) {
    const [showError, setShowError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    const [form, setForm] = React.useState({
        word: '',
        definition: '',
        wordType: '',
        category: '',
        exampleSentence: '',
        isActive: true,
    });

    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
    const [errors, setErrors] = React.useState<Record<string, string>>({});
    const [showSuccess, setShowSuccess] = React.useState(false);
    const baseUrl = process.env.NEXT_PUBLIC_API_ROOT;

    const handleChange = (field: string, value: any) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (file: File | null) => {
        setSelectedFile(file);
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(null);
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!form.word.trim()) newErrors.word = 'Bắt buộc nhập ký hiệu';
        if (!form.definition.trim()) newErrors.definition = 'Bắt buộc nhập định nghĩa';
        if (!form.wordType) newErrors.wordType = 'Bắt buộc chọn loại từ';
        if (!form.category) newErrors.category = 'Bắt buộc chọn chủ đề';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const resetForm = () => {
        setForm({
            word: '',
            definition: '',
            wordType: '',
            category: '',
            exampleSentence: '',
            isActive: true,
        });
        setSelectedFile(null);
        setPreviewUrl(null);
        setErrors({});
    };

    const handleSave = async () => {
        if (!validate()) return;

        try {
            const res = await api.post('/api/admin/signwords', form);

            if (res.status !== 201) {
                setErrorMessage('Có lỗi khi tạo ký hiệu!');
                setShowError(true);
                return;
            }

            const createdSignWord = res.data;

            if (selectedFile) {
                const videoForm = new FormData();
                videoForm.append('file', selectedFile);

                const videoRes = await fetch(
                    `${baseUrl}/api/admin/upload-video/${createdSignWord.signWordId}`,
                    { method: 'POST', body: videoForm }
                );

                if (!videoRes.ok) {
                    const err = await videoRes.text();
                    console.error('Upload video failed:', err);
                    setErrorMessage('Lỗi khi upload video!');
                    setShowError(true);
                    return;
                }
            }

            setShowSuccess(true);
            onCreated();
            onClose();
            resetForm();
        } catch (err) {
            console.error('Tạo ký hiệu thất bại', err);
            setErrorMessage('Có lỗi xảy ra!');
            setShowError(true);
        }
    };
    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>Thêm từ mới</DialogTitle>
                <DialogContent>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} mt={1}>
                        {/* Left Column: Form Fields */}
                        <Box sx={{ flex: 1 }}>
                            <Stack spacing={2}>
                                <TextField
                                    label="Ký hiệu"
                                    value={form.word}
                                    onChange={(e) => handleChange('word', e.target.value)}
                                    error={!!errors.word}
                                    helperText={errors.word}
                                    fullWidth
                                />
                                <TextField
                                    label="Định nghĩa"
                                    value={form.definition}
                                    onChange={(e) => handleChange('definition', e.target.value)}
                                    error={!!errors.definition}
                                    helperText={errors.definition}
                                    multiline
                                    rows={3}
                                    fullWidth
                                />
                                <FormControl fullWidth error={!!errors.wordType}>
                                    <InputLabel>Loại từ</InputLabel>
                                    <Select
                                        value={form.wordType}
                                        onChange={(e) => handleChange('wordType', e.target.value)}
                                        label="Loại từ"
                                    >
                                        {WORD_TYPES.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.wordType && (
                                        <Typography color="error" variant="caption">
                                            {errors.wordType}
                                        </Typography>
                                    )}
                                </FormControl>
                                <FormControl fullWidth error={!!errors.category}>
                                    <InputLabel>Chủ đề</InputLabel>
                                    <Select
                                        value={form.category}
                                        onChange={(e) => handleChange('category', e.target.value)}
                                        label="Chủ đề"
                                    >
                                        {CATEGORIES.map((cat) => (
                                            <MenuItem key={cat} value={cat}>
                                                {cat}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.category && (
                                        <Typography color="error" variant="caption">
                                            {errors.category}
                                        </Typography>
                                    )}
                                </FormControl>
                                <FormControl fullWidth error={!!errors.category}>
                                    <TextField
                                        label="Câu ví dụ"
                                        value={form.exampleSentence}
                                        onChange={(e) => handleChange('exampleSentence', e.target.value)}
                                        fullWidth
                                    />
                                </FormControl>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={form.isActive}
                                            onChange={(e) => handleChange('isActive', e.target.checked)}
                                        />
                                    }
                                    label="Trạng thái hoạt động"
                                />
                            </Stack>
                        </Box>

                        {/* Right Column: Upload + Preview */}
                        <Box sx={{ flex: 1 }}>
                            <Stack spacing={2}>
                                <Button variant="outlined" component="label">
                                    Chọn video
                                    <input
                                        type="file"
                                        hidden
                                        accept="video/*"
                                        onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                                    />
                                </Button>

                                {selectedFile && <Typography variant="caption">File đã chọn: {selectedFile.name}</Typography>}

                                {previewUrl && (
                                    <Card sx={{ p: 1, mt: 1, borderRadius: 2, boxShadow: 1, bgcolor: '#fafafa' }}>
                                        <Typography sx={{ mb: 1, fontWeight: 600 }}>Preview Video</Typography>
                                        <video src={previewUrl} controls width="100%" style={{ borderRadius: 12 }} />
                                    </Card>
                                )}
                            </Stack>
                        </Box>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button variant="contained" onClick={handleSave}>
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbars */}
            <Snackbar
                open={showError}
                autoHideDuration={2500}
                onClose={() => setShowError(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>

            <Snackbar
                open={showSuccess}
                autoHideDuration={2500}
                onClose={() => setShowSuccess(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" sx={{ width: '100%' }}>
                    Tạo ký hiệu thành công!
                </Alert>
            </Snackbar>
        </>
    );
}
