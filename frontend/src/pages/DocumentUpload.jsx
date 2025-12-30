import { useState } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { documentAPI } from '../services/api'

export default function DocumentUpload() {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setError(null)
      setUploadStatus(null)
    } else {
      setError('Please select a PDF file')
      setFile(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setUploading(true)
    setError(null)
    setUploadStatus(null)

    try {
      const result = await documentAPI.upload(file)
      setUploadStatus({
        type: 'success',
        message: 'Document uploaded successfully! AI extraction is processing...',
        data: result
      })
      setFile(null)

      setTimeout(async () => {
        try {
          const updated = await documentAPI.getDocument(result.id)
          if (updated.status === 'completed') {
            setUploadStatus({
              type: 'success',
              message: 'Document processed successfully!',
              data: updated
            })
          } else if (updated.status === 'failed') {
            setUploadStatus({
              type: 'error',
              message: `Processing failed: ${updated.error_message}`,
              data: updated
            })
          }
        } catch (err) {
          console.error('Error checking status:', err)
        }
      }, 3000)

    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.')
      setUploadStatus({ type: 'error', message: 'Upload failed' })
    } finally {
      setUploading(false)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile)
      setError(null)
      setUploadStatus(null)
    } else {
      setError('Please drop a PDF file')
    }
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Upload Loan Document</h1>
          <p className="mt-2 text-sm text-gray-600">
            Upload a syndicated loan PDF document for AI-powered data extraction
          </p>
        </div>

        {/* Upload Area */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Drop your PDF file here, or{' '}
                <span className="text-blue-600 hover:text-blue-500">browse</span>
              </span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </label>
            <p className="mt-1 text-xs text-gray-500">PDF files only, up to 10MB</p>
          </div>

          {file && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-700">
              <FileText className="h-5 w-5 text-blue-500" />
              <span className="font-medium">{file.name}</span>
              <span className="text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {uploadStatus && uploadStatus.type === 'success' && (
          <div className="mt-4 rounded-md bg-green-50 p-4">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{uploadStatus.message}</p>
                <p className="mt-1 text-xs text-green-700">
                  Document ID: {uploadStatus.data.id} | Status: {uploadStatus.data.status}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="mt-6">
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? (
              <>
                <Loader className="animate-spin h-5 w-5 mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Upload & Process Document
              </>
            )}
          </button>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">What happens after upload?</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Document is securely stored and processed</li>
            <li>AI extracts key loan data (borrower, amount, terms, etc.)</li>
            <li>Covenants are automatically identified and categorized</li>
            <li>Results appear in the Dashboard within seconds</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
