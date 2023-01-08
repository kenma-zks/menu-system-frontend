import React, { SetStateAction } from 'react'
import { Button } from '@chakra-ui/react'

interface ButtonComponentProps {
  name: string
  isActive: boolean
  setActiveTag: React.Dispatch<SetStateAction<string>>
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  name,
  isActive,
  setActiveTag,
}) => {
  return (
    <Button
      border="1px solid gray"
      borderRadius="20px"
      height={{ base: '1.8rem', md: '2rem', lg: '2.5rem' }}
      minWidth="100px"
      onClick={() => setActiveTag(name)}
      _hover={{}}
      background={isActive ? '#bf7841' : 'white'}
      transitionDuration={isActive ? '0s' : '0s'}
      fontSize={{ base: '0.7rem', md: '0.8rem', lg: '1rem' }}
    >
      {name}
    </Button>
  )
}

export default ButtonComponent
