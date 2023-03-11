import { Box, Button, Flex, HStack, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { FiImage, FiX } from 'react-icons/fi'

interface UploadImageProps {
  onImageUpload: (image: File | null) => void
  defaultImage?: string
}

let removeCalled = false

const UploadImage = ({ onImageUpload, defaultImage }: UploadImageProps) => {
  const [imagePreview, setImagePreview] = useState<File | null>(null)

  const [currentFile, setCurrentFile] = useState<string | null>(
    defaultImage || null,
  )

  const [dragActive, setDragActive] = useState(false)

  const handleImageUpload = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setImagePreview(file)
      onImageUpload(file)
    }
  }

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(file)
      }
      reader.readAsDataURL(file)
    }
  }

  useEffect(() => {
    if (imagePreview) {
      onImageUpload(imagePreview)
    }
  }, [imagePreview])

  useEffect(() => {
    if (defaultImage) {
      setCurrentFile(defaultImage)
    }
  }, [defaultImage])

  useEffect(() => {
    if (removeCalled) {
      onImageUpload(null)
      removeCalled = false
    }
  }, [removeCalled])

  return (
    <Box
      borderRadius="md"
      width="100%"
      border={dragActive ? '2px dashed blue' : '2px dashed #e2e8f0'}
      height="200px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {(imagePreview || currentFile) && (
        <Flex
          position="relative"
          alignItems="flex-start"
          height="100%"
          width="100%"
        >
          <Box
            bgImage={
              currentFile ? currentFile : URL.createObjectURL(imagePreview!)
            }
            bgSize="cover"
            bgPosition="center"
            height="100%"
            width="100%"
          >
            <Button
              position="absolute"
              right={2}
              top={2}
              size="sm"
              colorScheme="red"
              onClick={() => {
                removeCalled = true
                setImagePreview(null)
                setCurrentFile(null)
              }}
            >
              <FiX />
            </Button>
          </Box>
        </Flex>
      )}

      {!imagePreview && !currentFile && (
        <VStack alignItems="center" spacing="2">
          <FiImage size="40px" />
          <HStack>
            <Text fontSize="sm">Drag and Drop or</Text>
            <Text
              fontSize="sm"
              fontWeight={'semibold'}
              cursor="pointer"
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              Browse
            </Text>
            <input
              type={'file'}
              accept=".jpg, .jpeg, .png"
              id="fileInput"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            ></input>
          </HStack>

          <Text fontSize="xs" color="gray.500">
            Files supported : .jpg, .jpeg, .png (Max 10MB)
          </Text>
        </VStack>
      )}
    </Box>
  )
}

export default UploadImage
