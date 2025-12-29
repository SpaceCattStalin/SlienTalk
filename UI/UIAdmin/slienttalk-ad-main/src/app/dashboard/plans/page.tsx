'use client';

import * as React from 'react';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import api from '@/utils/axiosConfig';

interface Plan {
    planId: string;
    name: string;
    price: number;
    currency: string;
    durationDays: number;
    isActive: boolean;
    updatedAt: number;
}

export default function PlansPage() {
    const [plans, setPlans] = React.useState<Plan[]>([]);
    const [openModal, setOpenModal] = React.useState(false);
    const [editPlan, setEditPlan] = React.useState<Plan | null>(null);

    const [name, setName] = React.useState('');
    const [price, setPrice] = React.useState(0);
    const [durationDays, setDurationDays] = React.useState(0);

    const fetchPlans = async () => {
        try {
            const res = await api.get('/api/admin/plans');
            setPlans(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    React.useEffect(() => {
        fetchPlans();
    }, []);

    const handleOpenModal = (plan: Plan) => {
        setEditPlan(plan);
        setName(plan.name);
        setPrice(plan.price);
        setDurationDays(plan.durationDays);
        setOpenModal(true);
    };

    const handleSave = async () => {
        if (!editPlan) return;

        const updatedPlan = { name, price, durationDays };
        await api.put(`/api/admin/plans/${editPlan.planId.toLowerCase()}`, updatedPlan);
        setOpenModal(false);
        fetchPlans();
    };

    return (
        <>
            <Stack spacing={1} sx={{ flex: '1 1 auto', justifyContent: 'space-between', flexDirection: 'row' }}>
                <Typography variant="h4">Các gói đăng kí</Typography>
            </Stack>

            <Stack spacing={3} direction="row" flexWrap="wrap" sx={{marginTop: 3}}>
                {plans.map(plan => (
                    <Card
                        key={plan.planId}
                        sx={{
                            width: 260,
                            borderRadius: 2,
                            boxShadow: 3,
                            transition: '0.3s',
                            '&:hover': { boxShadow: 6 },
                            m: 1,
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" gutterBottom>{plan.name}</Typography>
                            <Typography>Giá: {plan.price.toLocaleString()} {plan.currency}</Typography>
                            <Typography>Thời hạn: {plan.durationDays} ngày</Typography>
                            <Typography>Trạng thái: {plan.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}</Typography>

                            {plan.planId === 'PREMIUM' && (
                                <Button
                                    variant="contained"
                                    sx={{ mt: 2 }}
                                    onClick={() => handleOpenModal(plan)}
                                >
                                    Cập nhật
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </Stack>

            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="edit-plan-modal"
                aria-describedby="edit-plan-form"
            >
                <Box
                    sx={{
                        position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 300,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Cập nhật gói đăng kí
                    </Typography>
                    <TextField
                        label="Tên gói"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        label="Giá"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        inputProps={{
                            step: 1000,
                            min: 0,
                            max: 1000000
                        }}
                    />
                    <TextField
                        label="Thời hạn (ngày)"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={durationDays}
                        onChange={(e) => setDurationDays(Number(e.target.value))}
                    />
                    <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
                        <Button variant="outlined" onClick={() => setOpenModal(false)}>Hủy</Button>
                        <Button variant="contained" onClick={handleSave}>Lưu</Button>
                    </Stack>
                </Box>
            </Modal>
        </>
    );
}
