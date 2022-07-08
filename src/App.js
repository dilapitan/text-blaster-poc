import React, { useState } from 'react';
import {
  Box,
  Button,
  ChakraProvider,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Textarea,
  Text,
  Grid,
  theme,
  useToast,
} from '@chakra-ui/react';
import { MdSend } from 'react-icons/md';
import { ColorModeSwitcher } from './ColorModeSwitcher';

function App() {
  const MAX_CHARACTER_COUNT = 160;
  const [announcement, setAnnouncement] = useState('');
  const [recipients, setRecipients] = useState('');
  const [isAnnouncementError, setIsAnnouncementError] = useState(false);
  const [isRecipientError, setIsRecipientError] = useState(false);
  const [isInvalidRecipients, setIsInvalidRecipients] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  function isValidRecipient(recipient) {
    const SIMPLE_CELLNUMBER_PATTERN = /^09[0-9]{9}$/g;
    return recipient.match(SIMPLE_CELLNUMBER_PATTERN);
  }

  function isValidRecipients(recipients) {
    /**
     * This is to check each recipient if it's a valid cellphone number
     */

    const recipientsSplitByComma = recipients.split(',');

    // This is to remove the duplicate numbers so the SMS credit won't be wasted.
    const recipientsWithNoDuplicates = [...new Set(recipientsSplitByComma)];

    let isValid = true;
    recipientsWithNoDuplicates.forEach(recipient => {
      if (!isValidRecipient(recipient.trim())) {
        isValid = false;
        return isValid;
      }
    });

    return isValid;
  }

  const handleAnnouncementChange = e => {
    if (e.target.value.length <= MAX_CHARACTER_COUNT) {
      setIsAnnouncementError(false);
      setAnnouncement(e.target.value);
    }
  };

  const handleRecipientsChange = e => {
    if (e.target.value === '') {
      setIsRecipientError(true);
    } else setIsRecipientError(false);

    setRecipients(e.target.value);
    if (isValidRecipients(e.target.value)) {
      setIsInvalidRecipients(false);
    } else {
      setIsInvalidRecipients(true);
    }
  };

  const handleBlurOnAnnouncement = () => {
    if (announcement === '') setIsAnnouncementError(true);
  };

  const handleOnBlurInRecipients = () => {
    if (recipients === '') setIsRecipientError(true);
  };

  const handleSubmit = event => {
    event.preventDefault();

    try {
      setIsLoading(true);
      console.log('announcement:', announcement);
      console.log('recipients:', recipients);
      setAnnouncement('');
      setRecipients('');

      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: 'Announcement successfully sent!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }, 2000);
    } catch (error) {
      toast({
        title: 'Something went wrong.',
        description: 'Please contact your support system.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw new Error(error);
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Box>
        <Grid p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <Container>
            <Heading>Text Blaster POC: </Heading>
            <br />
            <form onSubmit={handleSubmit}>
              <FormControl isInvalid={isAnnouncementError}>
                <FormLabel>Message:</FormLabel>
                <Textarea
                  id="announcement"
                  value={announcement}
                  placeholder="Enter announcement here"
                  onChange={handleAnnouncementChange}
                  onBlur={handleBlurOnAnnouncement}
                />

                {isAnnouncementError ? (
                  <FormErrorMessage>
                    Entering Message is required
                  </FormErrorMessage>
                ) : (
                  <Text
                    fontSize="sm"
                    ml={1}
                    color={announcement.length === 160 ? '#FB8C00' : null}
                  >
                    Maximum character count: {announcement.length}/160
                  </Text>
                )}

                <br />
                <br />
              </FormControl>

              <FormControl isInvalid={isRecipientError || isInvalidRecipients}>
                <FormLabel>Recepient(s):</FormLabel>
                <Text fontSize="xs" ml={1}>
                  Send to multiple numbers by separating with a comma.
                </Text>
                <Textarea
                  id="recipients"
                  value={recipients}
                  placeholder="e.g. 09995551234, 09997771234"
                  onChange={handleRecipientsChange}
                  onBlur={handleOnBlurInRecipients}
                />
                {isRecipientError && (
                  <FormErrorMessage>
                    Entering Recipients is required
                  </FormErrorMessage>
                )}

                {!isRecipientError && isInvalidRecipients && (
                  <FormErrorMessage>Invalid contact numbers.</FormErrorMessage>
                )}
              </FormControl>

              <br />

              <Button
                mt={4}
                colorScheme="blue"
                type="submit"
                rightIcon={<MdSend />}
                isLoading={isLoading}
                loadingText="Sending announcement..."
                disabled={
                  isInvalidRecipients ||
                  announcement === '' ||
                  recipients === ''
                }
              >
                Send Announcement
              </Button>
            </form>
          </Container>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
