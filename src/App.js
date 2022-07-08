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
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';

function App() {
  const MAX_CHARACTER_COUNT = 160;
  const [announcement, setAnnouncement] = useState('Hello World');
  const [recipients, setRecipients] = useState('');
  const [isAnnouncementError, setIsAnnouncementError] = useState(false);
  const [isRecipientError, setIsRecipientError] = useState(false);
  const [isInvalidRecipients, setIsInvalidRecipients] = useState(false);

  function isValidRecipients(recipients) {
    console.log('recipients:', recipients);

    return true;
  }

  const handleAnnouncementChange = e => {
    if (e.target.value.length <= MAX_CHARACTER_COUNT) {
      setIsAnnouncementError(false);
      setAnnouncement(e.target.value);
    }
  };

  const handleRecipientsChange = e => {
    setIsRecipientError(false);
    setRecipients(e.target.value);
  };

  const handleBlurOnAnnouncement = () => {
    if (announcement === '') setIsAnnouncementError(true);
  };

  const handleOnBlurInRecipients = () => {
    if (recipients === '') setIsRecipientError(true);
  };

  const handleSubmit = event => {
    event.preventDefault();

    console.log('announcement:', announcement);
    console.log('recipients:', recipients);

    if (isValidRecipients(recipients)) {
      setRecipients(recipients);
    } else setIsInvalidRecipients(true);
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
                    color={announcement.length === 160 ? 'tomato' : null}
                  >
                    Maximum character count: {announcement.length}/160
                  </Text>
                )}

                <br />
                <br />
              </FormControl>

              <FormControl isInvalid={isRecipientError}>
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
                {isInvalidRecipients && (
                  <FormErrorMessage>Invalid contact numbers.</FormErrorMessage>
                )}
              </FormControl>

              <br />

              <Button
                mt={4}
                colorScheme="teal"
                type="submit"
                disabled={
                  (isAnnouncementError &&
                    isRecipientError &&
                    isInvalidRecipients) ||
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
