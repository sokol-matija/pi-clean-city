namespace CleanCity.Tests.Commands
{
    public class DelegateCommandUnitTests
    {
        [Fact]
        public void Execute_ShouldCallAction()
        {
            // Arrange
            var executed = false;
            var command = new Core.Commands.DelegateCommand(() => executed = true);

            // Act
            command.Execute(null);

            // Assert
            Assert.True(executed);
        }

        [Fact]
        public void CanExecute_ShouldReturnTrue_WhenCanExecuteIsNull()
        {
            // Arrange
            var command = new Core.Commands.DelegateCommand(() => { });

            // Assert
            Assert.True(command.CanExecute(null));
        }

        [Fact]
        public void CanExecute_ShouldReturnPredicateResult()
        {
            // Arrange
            var canExecute = false;
            var command = new Core.Commands.DelegateCommand(() => { }, () => canExecute);

            // Assert
            Assert.False(command.CanExecute(null));

            // Arrange 2
            canExecute = true;

            // Assert 2
            Assert.True(command.CanExecute(null));
        }
        
        [Fact]
        public void RaiseCanExecuteChanged_ShouldRaiseEvent()
        {
            // Arrange
            var command = new Core.Commands.DelegateCommand(() => { });
            var eventRaised = false;
            command.CanExecuteChanged += (sender, args) => eventRaised = true;
            
            // Act
            command.RaiseCanExecuteChanged();
            
            // Assert
            Assert.True(eventRaised);
        }
    }
    
    public class DelegateCommandTUnitTests
    {
        [Fact]
        public void Execute_ShouldCallActionWithParameter()
        {
            // Arrange
            string passedParameter = null;
            var command = new Core.Commands.DelegateCommand<string>(p => passedParameter = p);
            var parameter = "test";
            
            // Act
            command.Execute(parameter);
            
            // Assert
            Assert.Equal(parameter, passedParameter);
        }

        [Fact]
        public void CanExecute_ShouldUsePredicate()
        {
            // Arrange
            var command = new Core.Commands.DelegateCommand<string>(p => { }, p => p != null);
            
            // Assert
            Assert.False(command.CanExecute(null));
            Assert.True(command.CanExecute("test"));
        }

        [Fact]
        public void CanExecute_ShouldUseDefault_WhenParameterIsWrongType()
        {
            // Arrange
            string receivedValue = "not null";
            var command = new Core.Commands.DelegateCommand<string>(p => { }, p => {
                receivedValue = p;
                return p == null;
            });
            
            // Act
            var result = command.CanExecute(123); // Pass an int instead of a string
            
            // Assert
            Assert.True(result); // Predicate should have been called with default(string), which is null
            Assert.Null(receivedValue); // Verify the predicate received null
        }
        
        [Fact]
        public void Execute_ShouldUseDefault_WhenParameterIsWrongType()
        {
            // Arrange
            string receivedValue = "initial";
            var command = new Core.Commands.DelegateCommand<string>(p => {
                receivedValue = p;
            });
            
            // Act
            command.Execute(123); // Pass an int instead of a string
            
            // Assert
            Assert.Null(receivedValue); // Action should have been called with default(string), which is null
        }
    }

    public class AsyncCommandUnitTests
    {
        [Fact]
        public async Task Execute_ShouldCallAsyncTask()
        {
            // Arrange
            var executed = false;
            var command = new Core.Commands.AsyncCommand(async () =>
            {
                await Task.Delay(1);
                executed = true;
            });
            
            // Act
            command.Execute(null);
            await Task.Delay(50); // Give time for the async void method to complete

            // Assert
            Assert.True(executed);
        }

        [Fact]
        public async Task CanExecute_ShouldBeFalse_WhileExecuting()
        {
            // Arrange
            var tcs = new TaskCompletionSource<bool>();
            var command = new Core.Commands.AsyncCommand(async () => await tcs.Task);
            
            // Assert initial state
            Assert.True(command.CanExecute(null));
            
            // Act
            command.Execute(null);
            
            // Assert executing state
            Assert.False(command.CanExecute(null));
            
            // Cleanup
            tcs.SetResult(true);
            await Task.Delay(10); // Give time for the command to finish

            // Assert final state
            Assert.True(command.CanExecute(null));
        }

        [Fact]
        public void CanExecute_ShouldReturnFalse_WhenPredicateReturnsFalse()
        {
            // Arrange
            var canExecute = false;
            var command = new Core.Commands.AsyncCommand(async () => await Task.Delay(1), () => canExecute);

            // Act & Assert
            Assert.False(command.CanExecute(null));
        }

        [Fact]
        public void CanExecute_ShouldReturnTrue_WhenPredicateReturnsTrue()
        {
            // Arrange
            var canExecute = true;
            var command = new Core.Commands.AsyncCommand(async () => await Task.Delay(1), () => canExecute);

            // Act & Assert
            Assert.True(command.CanExecute(null));
        }

        [Fact]
        public async Task Execute_ShouldNotRunTask_WhenCanExecuteIsFalse()
        {
            // Arrange
            var taskExecuted = false;
            var command = new Core.Commands.AsyncCommand(async () =>
            {
                await Task.Delay(1);
                taskExecuted = true;
            }, () => false); // CanExecute always returns false

            // Act
            command.Execute(null);
            await Task.Delay(50); // Give time for the async void method to complete

            // Assert
            Assert.False(taskExecuted); // Task should not have been executed
        }

        [Fact]
        public async Task Execute_ShouldResetIsExecuting_WhenTaskThrowsException()
        {
            // Arrange
            var command = new Core.Commands.AsyncCommand(async () =>
            {
                await Task.Delay(1);
                throw new InvalidOperationException("Test Exception");
            });

            // Act
            // Execute an async void method that throws an exception.
            // Assert.ThrowsAsync cannot reliably catch exceptions from async void.
            // We rely on the finally block in AsyncCommand to reset _isExecuting.
            command.Execute(null); 
            
            // Give time for the async void method to potentially complete and its finally block to execute
            await Task.Delay(1000); 

            // Assert that IsExecuting is reset after the exception (CanExecute becomes true)
            Assert.True(command.CanExecute(null));
        }
    }
}
