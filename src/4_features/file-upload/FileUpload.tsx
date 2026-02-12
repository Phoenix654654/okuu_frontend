import {useState} from "react";
import {Upload, Button, message} from "antd";
import {UploadOutlined, DeleteOutlined} from "@ant-design/icons";
import {fileService} from "@/5_entities/file";
import type {IUploadedFile} from "@/5_entities/file";

interface FileUploadProps {
    fileIds: number[];
    onChange: (fileIds: number[]) => void;
    disabled?: boolean;
}

interface UploadedItem extends IUploadedFile {
    name: string;
}

export const FileUpload = ({fileIds, onChange, disabled}: FileUploadProps) => {
    const [files, setFiles] = useState<UploadedItem[]>([]);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (file: File) => {
        setUploading(true);
        try {
            const response = await fileService.upload(file);
            const uploaded: UploadedItem = {
                ...response.extra,
                name: file.name,
            };
            const newFiles = [...files, uploaded];
            setFiles(newFiles);
            onChange(newFiles.map(f => f.id));
            message.success(`${file.name} загружен`);
        } catch {
            message.error(`Ошибка загрузки ${file.name}`);
        } finally {
            setUploading(false);
        }
        return false;
    };

    const handleRemove = async (fileId: number) => {
        try {
            await fileService.delete(fileId);
        } catch {
            // файл может быть уже удалён
        }
        const newFiles = files.filter(f => f.id !== fileId);
        setFiles(newFiles);
        onChange(newFiles.map(f => f.id));
    };

    return (
        <div>
            <Upload
                beforeUpload={handleUpload}
                showUploadList={false}
                disabled={disabled || uploading}
            >
                <Button icon={<UploadOutlined />} loading={uploading} disabled={disabled}>
                    Загрузить файл
                </Button>
            </Upload>
            {files.length > 0 && (
                <div style={{marginTop: 8}}>
                    {files.map(file => (
                        <div key={file.id} style={{display: "flex", alignItems: "center", gap: 8, marginBottom: 4}}>
                            <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>
                            {!disabled && (
                                <Button
                                    type="text"
                                    size="small"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleRemove(file.id)}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
